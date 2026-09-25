import { Request, Response } from 'express';
import { prisma } from '../prisma';

export async function getServices(req: Request, res: Response) {
  try {
    const services = await prisma.service.findMany({
      include: {
        _count: {
          select: { workers: true, bookings: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    return res.json({ services });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch services', details: error.message });
  }
}

export async function getServiceDetails(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const service = await prisma.service.findFirst({
      where: {
        OR: [{ id }, { name: id.toLowerCase() }],
      },
      include: {
        workers: {
          include: {
            user: { select: { name: true, phone: true } },
            verifications: true,
            cooperativeMembership: { include: { cooperative: true } },
          },
        },
      },
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    return res.json({ service });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch service', details: error.message });
  }
}
