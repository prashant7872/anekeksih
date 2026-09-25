import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { AuthenticatedRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'anekek_sih2026_cooperative_secret_key';

export async function requestOtp(req: Request, res: Response) {
  const { phone } = req.body;
  if (!phone || phone.length < 10) {
    return res.status(400).json({ error: 'Valid 10-digit mobile number required' });
  }

  // Clear demo indicator: Hackathon demo OTP is 1234
  return res.json({
    success: true,
    message: 'Demo OTP sent successfully to +91 ' + phone,
    demoOtp: '1234',
    isDemo: true,
  });
}

export async function verifyOtp(req: Request, res: Response) {
  const { phone, otp, role = 'CUSTOMER', name } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP are required' });
  }

  // Demo mode OTP check
  if (otp !== '1234' && otp !== '0000') {
    return res.status(400).json({ error: 'Invalid OTP. For DEMO mode, please enter 1234.' });
  }

  try {
    let user = await prisma.user.findUnique({
      where: { phone },
      include: {
        workerProfile: {
          include: {
            skills: { include: { service: true } },
            verifications: true,
            cooperativeMembership: { include: { cooperative: true } },
          },
        },
        customerProfile: true,
      },
    });

    if (!user) {
      const defaultName = name || (role === 'WORKER' ? 'Worker Member' : 'Home Provider');
      user = await prisma.user.create({
        data: {
          phone,
          name: defaultName,
          role,
          locale: 'en',
          ...(role === 'CUSTOMER' && {
            customerProfile: {
              create: {
                locality: 'Powai',
                city: 'Mumbai',
                address: 'Hiranandani Gardens, Powai, Mumbai',
              },
            },
          }),
        },
        include: {
          workerProfile: {
            include: {
              skills: { include: { service: true } },
              verifications: true,
              cooperativeMembership: { include: { cooperative: true } },
            },
          },
          customerProfile: true,
        },
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        phone: user.phone,
        role: user.role,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user,
      message: 'Logged in successfully',
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
}

export async function demoQuickLogin(req: Request, res: Response) {
  const { role } = req.body; // WORKER, CUSTOMER, COOP_ADMIN, PLATFORM_ADMIN

  try {
    const user = await prisma.user.findFirst({
      where: { role },
      include: {
        workerProfile: {
          include: {
            skills: { include: { service: true } },
            verifications: true,
            cooperativeMembership: { include: { cooperative: true } },
          },
        },
        customerProfile: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: `No seeded user found for role ${role}. Please seed database.` });
    }

    const token = jwt.sign(
      {
        id: user.id,
        phone: user.phone,
        role: user.role,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user,
      message: `Switched to Demo ${role} successfully`,
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Quick login failed', details: error.message });
  }
}

export async function getCurrentUser(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        workerProfile: {
          include: {
            skills: { include: { service: true } },
            verifications: true,
            cooperativeMembership: { include: { cooperative: true } },
          },
        },
        customerProfile: true,
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
}

export async function registerWorker(req: Request, res: Response) {
  const {
    name,
    phone,
    aadhaarNumber,
    locality,
    serviceName,
    experienceYears = 1,
    shgName,
    hasBackgroundCert = false,
  } = req.body;

  if (!name || !phone || !aadhaarNumber || !locality) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  // Mask Aadhaar: e.g. "XXXX-XXXX-4821" (NEVER store raw Aadhaar)
  const cleanAadhaar = aadhaarNumber.replace(/\D/g, '');
  const maskedAadhaar = `XXXX-XXXX-${cleanAadhaar.slice(-4) || '4821'}`;

  try {
    // Find or create user
    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          name,
          role: 'WORKER',
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name, role: 'WORKER' },
      });
    }

    // Default primary cooperative
    const defaultCoop = await prisma.cooperative.findFirst();

    // Find service
    const service = await prisma.service.findFirst({
      where: {
        OR: [
          { name: (serviceName || '').toLowerCase() },
          { titleEn: serviceName },
        ],
      },
    });

    // Create or update worker profile
    let workerProfile = await prisma.workerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!workerProfile) {
      workerProfile = await prisma.workerProfile.create({
        data: {
          userId: user.id,
          locality,
          city: 'Mumbai',
          experienceYears: Number(experienceYears) || 1,
          primaryServiceId: service?.id,
          basePrice: service?.baseRate || 350,
          ownershipShare: 0.05,
          fairRotationPoints: 100,
          queuePosition: 3,
        },
      });
    }

    // Add Aadhaar verification record
    await prisma.workerVerification.create({
      data: {
        workerId: workerProfile.id,
        verificationType: 'AADHAAR_KYC',
        status: 'VERIFIED',
        documentMasked: maskedAadhaar,
        notes: 'Demo e-KYC Identity Verified via Digilocker/e-Shram simulation',
      },
    });

    // If eldercare/childcare, handle certificate
    if (hasBackgroundCert || (service && service.isSpecialized)) {
      await prisma.workerVerification.create({
        data: {
          workerId: workerProfile.id,
          verificationType: 'POLICE_BACKGROUND',
          status: 'VERIFIED',
          documentMasked: 'CERT-PB-VERIFIED',
          notes: 'Specialized Care Police Character Certificate Attached',
        },
      });
    }

    // Connect to cooperative
    if (defaultCoop) {
      await prisma.cooperativeMembership.upsert({
        where: { workerId: workerProfile.id },
        update: {
          shgAffiliation: shgName || 'Local Cooperative Collective',
          memberStatus: 'ACTIVE',
        },
        create: {
          workerId: workerProfile.id,
          cooperativeId: defaultCoop.id,
          shgAffiliation: shgName || 'Local Cooperative Collective',
          memberStatus: 'ACTIVE',
        },
      });
    }

    // Attach skill
    if (service) {
      await prisma.workerSkill.create({
        data: {
          workerId: workerProfile.id,
          serviceId: service.id,
          experienceYrs: Number(experienceYears) || 1,
          isVerified: true,
        },
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        phone: user.phone,
        role: 'WORKER',
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user,
      workerProfile,
      message: 'Worker registered and co-ownership initialized successfully',
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Worker registration failed', details: error.message });
  }
}
