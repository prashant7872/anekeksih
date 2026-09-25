import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthenticatedRequest } from '../middleware/auth';
import { runSeed } from '../services/seedService';

export async function getAdminAnalytics(req: Request, res: Response) {
  try {
    const totalWorkers = await prisma.workerProfile.count();
    const verifiedWorkers = await prisma.workerVerification.count({
      where: { status: 'VERIFIED' },
    });
    const totalCustomers = await prisma.customerProfile.count();
    const totalBookings = await prisma.booking.count();
    const pendingVerifications = await prisma.workerVerification.count({
      where: { status: 'PENDING' },
    });
    const openDisputes = await prisma.dispute.count({
      where: { status: 'OPEN' },
    });

    const fund = await prisma.cooperativeFund.findFirst();
    const totalRevenue = fund?.totalPlatformGross || 154000;
    const workerEarnings = (fund?.totalPlatformGross || 154000) - (fund?.totalCommission || 15400);

    // Demand by Service
    const services = await prisma.service.findMany({
      include: {
        _count: { select: { bookings: true, workers: true } },
      },
    });

    const serviceDemand = services.map((s) => ({
      name: s.titleEn,
      category: s.category,
      bookingsCount: s._count.bookings || Math.floor(Math.random() * 20 + 5),
      workersCount: s._count.workers || 2,
    }));

    // Weekly booking trends (Demo mock curve for presentation)
    const bookingTrends = [
      { day: 'Mon', bookings: 12, revenue: 5400, workerEarnings: 4860 },
      { day: 'Tue', bookings: 19, revenue: 8550, workerEarnings: 7695 },
      { day: 'Wed', bookings: 15, revenue: 6750, workerEarnings: 6075 },
      { day: 'Thu', bookings: 22, revenue: 9900, workerEarnings: 8910 },
      { day: 'Fri', bookings: 28, revenue: 12600, workerEarnings: 11340 },
      { day: 'Sat', bookings: 36, revenue: 16200, workerEarnings: 14580 },
      { day: 'Sun', bookings: 42, revenue: 18900, workerEarnings: 17010 },
    ];

    // Locality demand
    const localityDemand = [
      { locality: 'Powai', demandPct: 35, avgTurnaroundMin: 18 },
      { locality: 'Andheri East', demandPct: 25, avgTurnaroundMin: 22 },
      { locality: 'Chandivali', demandPct: 20, avgTurnaroundMin: 15 },
      { locality: 'Vikhroli', demandPct: 12, avgTurnaroundMin: 24 },
      { locality: 'Kanjurmarg', demandPct: 8, avgTurnaroundMin: 20 },
    ];

    // Recent bookings
    const recentBookings = await prisma.booking.findMany({
      include: {
        service: true,
        worker: { include: { user: { select: { name: true } } } },
        customer: { include: { user: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    // Pending Verifications list
    const pendingVerifsList = await prisma.workerVerification.findMany({
      where: { status: 'PENDING' },
      include: {
        worker: {
          include: {
            user: { select: { name: true, phone: true } },
            primaryService: true,
          },
        },
      },
      take: 5,
    });

    // Open Disputes
    const disputesList = await prisma.dispute.findMany({
      include: {
        booking: {
          include: {
            service: true,
            worker: { include: { user: { select: { name: true } } } },
          },
        },
        customer: { include: { user: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return res.json({
      metrics: {
        totalWorkers: totalWorkers || 12,
        verifiedWorkers: verifiedWorkers || 10,
        totalCustomers: totalCustomers || 28,
        bookingsTotal: totalBookings || 48,
        totalRevenue,
        workerEarnings,
        cooperativeFund: fund?.totalCommission || 15400,
        pendingVerifications,
        openDisputes,
      },
      serviceDemand,
      bookingTrends,
      localityDemand,
      recentBookings,
      pendingVerifsList,
      disputesList,
      isDemo: true,
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch admin analytics', details: error.message });
  }
}

export async function updateVerificationStatus(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const { status, notes } = req.body; // VERIFIED, REJECTED

  try {
    const verif = await prisma.workerVerification.update({
      where: { id },
      data: {
        status,
        notes: notes || undefined,
        verifiedAt: status === 'VERIFIED' ? new Date() : null,
      },
      include: { worker: { include: { user: true } } },
    });

    await prisma.notification.create({
      data: {
        userId: verif.worker.userId,
        title: `Verification ${status}`,
        message: `Your ${verif.verificationType.replace(/_/g, ' ')} has been marked as ${status}.`,
        type: 'VERIFICATION',
      },
    });

    return res.json({ success: true, verification: verif });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update verification', details: error.message });
  }
}

export async function createDispute(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { bookingId, category, description } = req.body;

  if (!bookingId || !category || !description) {
    return res.status(400).json({ error: 'bookingId, category, and description are required' });
  }

  try {
    const customer = await prisma.customerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer profile required to file dispute' });
    }

    const dispute = await prisma.dispute.create({
      data: {
        bookingId,
        customerId: customer.id,
        category,
        description,
        status: 'OPEN',
      },
    });

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'DISPUTED' },
    });

    return res.status(201).json({
      success: true,
      dispute,
      message: 'Dispute submitted to cooperative dispute resolution board.',
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to submit dispute', details: error.message });
  }
}

export async function updateDisputeStatus(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const { status, resolution } = req.body; // OPEN, UNDER_REVIEW, RESOLVED, REJECTED

  try {
    const dispute = await prisma.dispute.update({
      where: { id },
      data: {
        status,
        resolution,
      },
      include: {
        customer: { include: { user: true } },
        booking: true,
      },
    });

    await prisma.notification.create({
      data: {
        userId: dispute.customer.userId,
        title: `Dispute ${status}`,
        message: `Your query for #${dispute.booking.bookingNumber} is now marked ${status}: ${resolution || 'Resolution recorded.'}`,
        type: 'BOOKING',
      },
    });

    return res.json({ success: true, dispute });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update dispute', details: error.message });
  }
}

export async function getNotifications(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return res.json({ notifications });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch notifications', details: error.message });
  }
}

export async function markNotificationsAsRead(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true },
    });
    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update notifications', details: error.message });
  }
}

export async function resetDemoData(req: Request, res: Response) {
  try {
    await runSeed();
    return res.json({
      success: true,
      message: 'Demo database reset to clean Smart India Hackathon 2026 seed state.',
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to reset demo data', details: error.message });
  }
}
