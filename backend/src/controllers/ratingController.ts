import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthenticatedRequest } from '../middleware/auth';

export async function submitRating(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { bookingId, rating, comment } = req.body;

  if (!bookingId || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Valid bookingId and rating (1-5 stars) are required' });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        worker: { include: { user: true } },
        customer: { include: { user: true } },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if already rated by this user for this booking
    const existing = await prisma.review.findFirst({
      where: {
        bookingId,
        reviewerId: req.user.id,
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'You have already rated this booking.' });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        bookingId,
        reviewerId: req.user.id,
        workerId: booking.workerId,
        rating: Number(rating),
        comment: comment || 'Verified cooperative service delivery.',
      },
    });

    // Recalculate Worker aggregate rating
    const allReviews = await prisma.review.findMany({
      where: { workerId: booking.workerId },
    });

    const totalStars = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = Number((totalStars / allReviews.length).toFixed(1));

    await prisma.workerProfile.update({
      where: { id: booking.workerId },
      data: {
        averageRating,
        ratingsCount: allReviews.length,
      },
    });

    // Send notification
    await prisma.notification.create({
      data: {
        userId: booking.worker.userId,
        title: 'New Rating Received',
        message: `${req.user.name} rated you ${rating}★: "${comment || 'Great service'}"`,
        type: 'RATING',
      },
    });

    return res.json({
      success: true,
      review,
      workerStats: {
        averageRating,
        ratingsCount: allReviews.length,
      },
      message: 'Thank you! Your rating has been recorded.',
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Rating submission failed', details: error.message });
  }
}

export async function getWorkerRatings(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;

  try {
    const worker = await prisma.workerProfile.findFirst({
      where: { OR: [{ id }, { userId: id }] },
      include: {
        receivedReviews: {
          include: { reviewer: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    // Compute distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    worker.receivedReviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        distribution[r.rating as 1 | 2 | 3 | 4 | 5]++;
      }
    });

    return res.json({
      averageRating: worker.averageRating,
      ratingsCount: worker.ratingsCount,
      distribution,
      reviews: worker.receivedReviews,
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch reviews', details: error.message });
  }
}
