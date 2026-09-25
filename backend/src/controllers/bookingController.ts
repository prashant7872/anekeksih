import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthenticatedRequest } from '../middleware/auth';
import { calculatePricing } from '../services/pricing';
import { calculateDistanceKm } from '../services/aiMatching';

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const {
    workerId,
    serviceId,
    scheduledDate,
    scheduledTime,
    serviceAddress,
    instructions,
    paymentMethod = 'UPI',
    customerLat = 19.1176,
    customerLng = 72.9060,
  } = req.body;

  if (!workerId || !serviceId || !scheduledDate || !scheduledTime || !serviceAddress) {
    return res.status(400).json({ error: 'Missing required booking details' });
  }

  try {
    // Find customer profile
    let customerProfile = await prisma.customerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!customerProfile) {
      customerProfile = await prisma.customerProfile.create({
        data: {
          userId: req.user.id,
          locality: 'Powai',
          address: serviceAddress,
          lat: customerLat,
          lng: customerLng,
        },
      });
    }

    // Find worker
    const worker = await prisma.workerProfile.findUnique({
      where: { id: workerId },
      include: {
        user: true,
        cooperativeMembership: { include: { cooperative: true } },
      },
    });

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    // Find service
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Calculate distance & transparent pricing
    const distanceKm = calculateDistanceKm(customerLat, customerLng, worker.lat, worker.lng);
    const commissionPct = worker.cooperativeMembership?.cooperative?.commissionPct || 10.0;
    const priceBreakdown = calculatePricing(worker.basePrice, distanceKm, commissionPct);

    const bookingNumber = `BK-${Date.now().toString().slice(-6)}`;

    // Create booking and chat session
    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        customerId: customerProfile.id,
        workerId: worker.id,
        serviceId: service.id,
        scheduledDate,
        scheduledTime,
        serviceAddress,
        instructions,
        basePrice: priceBreakdown.basePrice,
        distanceKm: priceBreakdown.distanceKm,
        distanceFee: priceBreakdown.distanceFee,
        totalAmount: priceBreakdown.totalAmount,
        workerEarning: priceBreakdown.workerEarning,
        commissionAmount: priceBreakdown.commissionAmount,
        commissionPct: priceBreakdown.commissionPct,
        paymentStatus: 'PENDING',
        paymentMethod,
        status: 'REQUESTED',
        chat: {
          create: {
            messages: {
              create: {
                senderId: req.user.id,
                message: `Hello! I have requested a booking for ${service.titleEn} on ${scheduledDate} at ${scheduledTime}.`,
              },
            },
          },
        },
      },
      include: {
        worker: { include: { user: true } },
        service: true,
        customer: { include: { user: true } },
        chat: true,
      },
    });

    // Notify worker
    await prisma.notification.create({
      data: {
        userId: worker.userId,
        title: 'New Booking Request',
        message: `New booking request from ${req.user.name} for ${service.titleEn} (${scheduledDate} at ${scheduledTime}).`,
        type: 'BOOKING',
      },
    });

    return res.status(201).json({
      success: true,
      booking,
      priceBreakdown,
      message: 'Booking created successfully. Worker has been notified.',
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Booking creation failed', details: error.message });
  }
}

export async function updateBookingStatus(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { id } = req.params;
  const { status, cancellationReason } = req.body;

  const validStatuses = [
    'REQUESTED',
    'ACCEPTED',
    'REJECTED',
    'CONFIRMED',
    'ON_THE_WAY',
    'STARTED',
    'COMPLETED',
    'CANCELLED',
    'DISPUTED',
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        worker: {
          include: {
            user: true,
            cooperativeMembership: { include: { cooperative: true } },
          },
        },
        customer: { include: { user: true } },
        service: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status,
        ...(status === 'COMPLETED' ? { paymentStatus: 'COMPLETED' } : {}),
      },
    });

    // Handle job completion: transparent earnings credit & cooperative fund update
    if (status === 'COMPLETED') {
      const coBreakdown = calculatePricing(
        booking.basePrice,
        booking.distanceKm,
        booking.commissionPct
      );

      // 1. Record Worker Earning
      await prisma.workerEarning.upsert({
        where: { bookingId: booking.id },
        update: {
          grossAmount: booking.totalAmount,
          commissionDeducted: booking.commissionAmount,
          netEarnings: booking.workerEarning,
          welfareContribution: coBreakdown.cooperativeShare.welfare,
          dividendAccrued: coBreakdown.cooperativeShare.dividend,
          payoutStatus: 'CREDITED',
        },
        create: {
          workerId: booking.workerId,
          bookingId: booking.id,
          grossAmount: booking.totalAmount,
          commissionDeducted: booking.commissionAmount,
          netEarnings: booking.workerEarning,
          welfareContribution: coBreakdown.cooperativeShare.welfare,
          dividendAccrued: coBreakdown.cooperativeShare.dividend,
          payoutStatus: 'CREDITED',
        },
      });

      // 2. Increment worker completed count & update fair rotation points
      await prisma.workerProfile.update({
        where: { id: booking.workerId },
        data: {
          completedJobsCount: { increment: 1 },
          fairRotationPoints: { decrement: 15 }, // Fair rotation: worked recently -> queue adjusts
        },
      });

      // 3. Update Cooperative Fund
      const coopId = booking.worker.cooperativeMembership?.cooperativeId;
      if (coopId) {
        await prisma.cooperativeFund.upsert({
          where: { cooperativeId: coopId },
          update: {
            totalPlatformGross: { increment: booking.totalAmount },
            totalCommission: { increment: booking.commissionAmount },
            welfarePool: { increment: coBreakdown.cooperativeShare.welfare },
            insurancePool: { increment: coBreakdown.cooperativeShare.insurance },
            reinvestmentPool: { increment: coBreakdown.cooperativeShare.reinvestment },
            dividendPool: { increment: coBreakdown.cooperativeShare.dividend },
          },
          create: {
            cooperativeId: coopId,
            totalPlatformGross: booking.totalAmount,
            totalCommission: booking.commissionAmount,
            welfarePool: coBreakdown.cooperativeShare.welfare,
            insurancePool: coBreakdown.cooperativeShare.insurance,
            reinvestmentPool: coBreakdown.cooperativeShare.reinvestment,
            dividendPool: coBreakdown.cooperativeShare.dividend,
          },
        });
      }

      // 4. Send Notifications
      await prisma.notification.create({
        data: {
          userId: booking.customer.userId,
          title: 'Job Completed',
          message: `${booking.worker.user.name} has marked your ${booking.service.titleEn} job as completed. Please leave a rating!`,
          type: 'RATING',
        },
      });

      await prisma.notification.create({
        data: {
          userId: booking.worker.userId,
          title: 'Earnings Credited',
          message: `₹${booking.workerEarning} credited for booking #${booking.bookingNumber}. ₹${coBreakdown.cooperativeShare.welfare} added to your welfare pool!`,
          type: 'PAYMENT',
        },
      });
    } else {
      // Notify other party of status transition
      const targetUserId =
        req.user.id === booking.customer.userId
          ? booking.worker.userId
          : booking.customer.userId;

      await prisma.notification.create({
        data: {
          userId: targetUserId,
          title: `Booking Update: ${status}`,
          message: `Booking #${booking.bookingNumber} (${booking.service.titleEn}) is now marked as ${status.replace(/_/g, ' ')}.`,
          type: 'BOOKING',
        },
      });
    }

    return res.json({
      success: true,
      booking: updatedBooking,
      message: `Booking updated to ${status}`,
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update booking status', details: error.message });
  }
}

export async function getBookings(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    let whereClause: any = {};

    if (req.user.role === 'CUSTOMER') {
      const customer = await prisma.customerProfile.findUnique({
        where: { userId: req.user.id },
      });
      if (customer) {
        whereClause.customerId = customer.id;
      }
    } else if (req.user.role === 'WORKER') {
      const worker = await prisma.workerProfile.findUnique({
        where: { userId: req.user.id },
      });
      if (worker) {
        whereClause.workerId = worker.id;
      }
    }
    // PLATFORM_ADMIN & COOP_ADMIN see all

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        worker: {
          include: {
            user: { select: { id: true, name: true, phone: true } },
            cooperativeMembership: { include: { cooperative: true } },
          },
        },
        customer: {
          include: {
            user: { select: { id: true, name: true, phone: true } },
          },
        },
        service: true,
        payment: true,
        reviews: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ bookings });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
  }
}

export async function getBookingById(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        worker: {
          include: {
            user: true,
            cooperativeMembership: { include: { cooperative: true } },
          },
        },
        customer: { include: { user: true } },
        service: true,
        payment: { include: { transactions: true } },
        reviews: true,
        chat: {
          include: {
            messages: {
              include: { sender: { select: { id: true, name: true } } },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    return res.json({ booking });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch booking', details: error.message });
  }
}
