import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { computeWorkerMatchScore } from '../services/aiMatching';
import { AuthenticatedRequest } from '../middleware/auth';

export async function getWorkers(req: Request, res: Response) {
  const {
    service,
    locality,
    maxDistance = '15',
    maxBudget,
    sortBy = 'ai_match', // ai_match, rating, distance, price_low
    userLat = '19.1176', // Default Mumbai Powai
    userLng = '72.9060',
  } = req.query;

  const latNum = parseFloat(userLat as string) || 19.1176;
  const lngNum = parseFloat(userLng as string) || 72.9060;

  try {
    const workers = await prisma.workerProfile.findMany({
      include: {
        user: { select: { id: true, name: true, phone: true } },
        primaryService: true,
        skills: { include: { service: true } },
        verifications: true,
        cooperativeMembership: { include: { cooperative: true } },
      },
    });

    // Score workers using explainable AI algorithm
    const scoredWorkers = workers.map((worker) => {
      const matchDetails = computeWorkerMatchScore(
        worker as any,
        service as string | null,
        latNum,
        lngNum
      );

      // Mask phone for customer privacy
      const maskedPhone = worker.user.phone
        ? `${worker.user.phone.slice(0, 3)}•••••${worker.user.phone.slice(-2)}`
        : '••••••••••';

      return {
        ...worker,
        user: {
          ...worker.user,
          phone: maskedPhone,
        },
        aiMatch: matchDetails,
      };
    });

    // Filter by max distance and budget
    let filtered = scoredWorkers.filter((w) => {
      if (service) {
        const matchesService =
          w.primaryService?.name === (service as string).toLowerCase() ||
          w.skills.some((s) => s.service.name === (service as string).toLowerCase() || s.service.id === service);
        if (!matchesService) return false;
      }
      if (maxBudget && w.basePrice > parseFloat(maxBudget as string)) {
        return false;
      }
      if (w.aiMatch.distanceKm > parseFloat(maxDistance as string)) {
        return false;
      }
      return true;
    });

    // Sort workers
    if (sortBy === 'ai_match') {
      filtered.sort((a, b) => b.aiMatch.totalScore - a.aiMatch.totalScore);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.averageRating - a.averageRating);
    } else if (sortBy === 'distance') {
      filtered.sort((a, b) => a.aiMatch.distanceKm - b.aiMatch.distanceKm);
    } else if (sortBy === 'price_low') {
      filtered.sort((a, b) => a.basePrice - b.basePrice);
    }

    return res.json({
      workers: filtered,
      count: filtered.length,
      searchCenter: { lat: latNum, lng: lngNum },
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to retrieve workers', details: error.message });
  }
}

export async function getWorkerById(req: Request, res: Response) {
  const { id } = req.params;
  const { userLat = '19.1176', userLng = '72.9060' } = req.query;

  try {
    const worker = await prisma.workerProfile.findFirst({
      where: {
        OR: [{ id }, { userId: id }],
      },
      include: {
        user: { select: { id: true, name: true, phone: true } },
        primaryService: true,
        skills: { include: { service: true } },
        verifications: true,
        cooperativeMembership: { include: { cooperative: true } },
        receivedReviews: {
          include: { reviewer: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!worker) {
      return res.status(404).json({ error: 'Worker profile not found' });
    }

    const aiMatch = computeWorkerMatchScore(
      worker as any,
      worker.primaryServiceId,
      parseFloat(userLat as string) || 19.1176,
      parseFloat(userLng as string) || 72.9060
    );

    const maskedPhone = worker.user.phone
      ? `${worker.user.phone.slice(0, 3)}•••••${worker.user.phone.slice(-2)}`
      : '••••••••••';

    return res.json({
      worker: {
        ...worker,
        user: { ...worker.user, phone: maskedPhone },
        aiMatch,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to retrieve worker', details: error.message });
  }
}

export async function updateWorkerAvailability(req: AuthenticatedRequest, res: Response) {
  if (!req.user || req.user.role !== 'WORKER') {
    return res.status(403).json({ error: 'Only workers can update availability' });
  }

  const { isAvailable } = req.body;

  try {
    const profile = await prisma.workerProfile.update({
      where: { userId: req.user.id },
      data: { isAvailable: Boolean(isAvailable) },
    });

    return res.json({
      success: true,
      message: `Availability updated to ${isAvailable ? 'Available' : 'Unavailable'}`,
      isAvailable: profile.isAvailable,
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update availability', details: error.message });
  }
}
