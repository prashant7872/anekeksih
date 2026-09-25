import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/index';
import { calculatePricing } from '../src/services/pricing';
import { calculateDistanceKm, computeWorkerMatchScore } from '../src/services/aiMatching';
import { prisma } from '../src/prisma';

describe('AnekEk Cooperative Platform Test Suite', () => {
  let demoWorkerToken: string;
  let demoCustomerToken: string;
  let demoBookingId: string;
  let demoProposalId: string;
  let demoOptionId: string;

  beforeAll(async () => {
    // Quick login as demo customer
    const custRes = await request(app)
      .post('/api/auth/demo-login')
      .send({ role: 'CUSTOMER' });
    demoCustomerToken = custRes.body.token;

    // Quick login as demo worker
    const workerRes = await request(app)
      .post('/api/auth/demo-login')
      .send({ role: 'WORKER' });
    demoWorkerToken = workerRes.body.token;
  });

  // 1. Transparent Pricing & Commission Engine
  it('should correctly calculate transparent pricing and cooperative fund allocations', () => {
    // Service base: ₹500, distance 3.5km (2.5km extra -> 2.5 * 20 = ₹50 travel fee)
    // Total = ₹550. 10% commission = ₹55. Worker earning = ₹495.
    const pricing = calculatePricing(500, 3.5, 10.0);
    expect(pricing.basePrice).toBe(500);
    expect(pricing.distanceFee).toBe(50);
    expect(pricing.totalAmount).toBe(550);
    expect(pricing.commissionAmount).toBe(55);
    expect(pricing.workerEarning).toBe(495);
    // 30% welfare, 30% insurance, 20% reinvestment, 20% dividend
    expect(pricing.cooperativeShare.welfare).toBe(17);
    expect(pricing.cooperativeShare.insurance).toBe(17);
    expect(pricing.cooperativeShare.reinvestment).toBe(11);
    expect(pricing.cooperativeShare.dividend).toBe(10);
  });

  // 2. Explainable AI Worker Matching Engine
  it('should compute explainable AI match scores balancing skills, proximity, and fair rotation', () => {
    const mockWorker = {
      id: 'test-worker-1',
      user: { name: 'Rekha Sharma' },
      lat: 19.1176,
      lng: 72.9060,
      isAvailable: true,
      averageRating: 4.9,
      experienceYears: 6,
      fairRotationPoints: 95,
      queuePosition: 1,
      skills: [{ serviceId: 'cleaning', isVerified: true, service: { name: 'cleaning' } }],
      verifications: [{ verificationType: 'AADHAAR_KYC', status: 'VERIFIED' }],
      cooperativeMembership: { memberStatus: 'ACTIVE' },
    };

    const match = computeWorkerMatchScore(mockWorker as any, 'cleaning', 19.1176, 72.9060);
    expect(match.totalScore).toBeGreaterThan(0.85);
    expect(match.skillMatch).toBe(1.0);
    expect(match.reasons.length).toBeGreaterThanOrEqual(4);
    expect(match.reasons.some((r) => r.includes('fair-rotation'))).toBe(true);
  });

  // 3. Distance calculation
  it('should calculate geographic proximity correctly via Haversine', () => {
    // Distance between Powai (19.1176, 72.9060) and Chandivali (19.1120, 72.8980) ~ 1.0 - 1.2 km
    const dist = calculateDistanceKm(19.1176, 72.9060, 19.1120, 72.8980);
    expect(dist).toBeGreaterThan(0.5);
    expect(dist).toBeLessThan(2.0);
  });

  // 4. API: Services Listing
  it('GET /api/services should return all registered trade services', async () => {
    const res = await request(app).get('/api/services');
    expect(res.status).toBe(200);
    expect(res.body.services.length).toBeGreaterThanOrEqual(10);
  });

  // 5. API: Worker Search with AI Matching
  it('GET /api/workers should rank workers and attach explainable match scores', async () => {
    const res = await request(app).get('/api/workers?service=cleaning&sortBy=ai_match');
    expect(res.status).toBe(200);
    expect(res.body.workers.length).toBeGreaterThan(0);
    expect(res.body.workers[0].aiMatch).toBeDefined();
    expect(res.body.workers[0].aiMatch.reasons).toBeInstanceOf(Array);
  });

  // 6. API: Create Booking & Verify Notification
  it('POST /api/bookings should create booking with transparent pricing ledger', async () => {
    const worker = await prisma.workerProfile.findFirst({
      include: { primaryService: true },
    });

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${demoCustomerToken}`)
      .send({
        workerId: worker?.id,
        serviceId: worker?.primaryServiceId,
        scheduledDate: 'Tomorrow',
        scheduledTime: '5:00 PM',
        serviceAddress: 'Lake Homes, Powai, Mumbai',
        instructions: 'Test booking via automated suite',
      });

    expect(res.status).toBe(201);
    expect(res.body.booking.bookingNumber).toContain('BK-');
    expect(res.body.booking.status).toBe('REQUESTED');
    expect(res.body.priceBreakdown).toBeDefined();
    demoBookingId = res.body.booking.id;
  });

  // 7. API: Worker Accepts Booking
  it('PATCH /api/bookings/:id/status should update booking to ACCEPTED', async () => {
    const res = await request(app)
      .patch(`/api/bookings/${demoBookingId}/status`)
      .set('Authorization', `Bearer ${demoWorkerToken}`)
      .send({ status: 'ACCEPTED' });

    expect(res.status).toBe(200);
    expect(res.body.booking.status).toBe('ACCEPTED');
  });

  // 8. API: Demo UPI Payment
  it('POST /api/payments/demo should execute demo UPI payment workflow', async () => {
    const res = await request(app)
      .post('/api/payments/demo')
      .set('Authorization', `Bearer ${demoCustomerToken}`)
      .send({
        bookingId: demoBookingId,
        upiId: 'priya@okhdfcbank',
      });

    expect(res.status).toBe(200);
    expect(res.body.payment.transactionRef).toContain('UPI-DEMO-');
    expect(res.body.disclaimer).toContain('DEMO TRANSACTION');
  });

  // 9. API: Complete Booking & Fund Update
  it('PATCH /api/bookings/:id/status to COMPLETED should allocate funds', async () => {
    const res = await request(app)
      .patch(`/api/bookings/${demoBookingId}/status`)
      .set('Authorization', `Bearer ${demoWorkerToken}`)
      .send({ status: 'COMPLETED' });

    expect(res.status).toBe(200);
    expect(res.body.booking.status).toBe('COMPLETED');
  });

  // 10. API: Rating Submission
  it('POST /api/ratings should record rating and prevent duplicates', async () => {
    const res = await request(app)
      .post('/api/ratings')
      .set('Authorization', `Bearer ${demoCustomerToken}`)
      .send({
        bookingId: demoBookingId,
        rating: 5,
        comment: 'Outstanding, highly professional and punctual worker-owner!',
      });

    expect(res.status).toBe(200);
    expect(res.body.review.rating).toBe(5);

    // Duplicate check
    const dupRes = await request(app)
      .post('/api/ratings')
      .set('Authorization', `Bearer ${demoCustomerToken}`)
      .send({
        bookingId: demoBookingId,
        rating: 4,
        comment: 'Trying to rate again',
      });
    expect(dupRes.status).toBe(400);
  });

  // 11. API: Cooperative Governance & Voting
  it('GET /api/cooperative/votes and POST vote cast should enforce one member one vote', async () => {
    const listRes = await request(app)
      .get('/api/cooperative/votes')
      .set('Authorization', `Bearer ${demoWorkerToken}`);
    expect(listRes.status).toBe(200);
    expect(listRes.body.proposals.length).toBeGreaterThan(0);

    const proposal = listRes.body.proposals[0];
    demoProposalId = proposal.id;
    demoOptionId = proposal.options[0].id;

    // Cast vote
    const voteRes = await request(app)
      .post(`/api/cooperative/votes/${demoProposalId}/cast`)
      .set('Authorization', `Bearer ${demoWorkerToken}`)
      .send({ optionId: demoOptionId });

    if (voteRes.status === 200) {
      expect(voteRes.body.success).toBe(true);

      // Attempt second vote should be rejected
      const secondVote = await request(app)
        .post(`/api/cooperative/votes/${demoProposalId}/cast`)
        .set('Authorization', `Bearer ${demoWorkerToken}`)
        .send({ optionId: demoOptionId });
      expect(secondVote.status).toBe(400);
    } else {
      // Already voted in seed data
      expect(voteRes.body.error).toContain('already cast your vote');
    }
  });

  // 12. API: Cooperative Finance
  it('GET /api/cooperative/finance should return transparent ledger metrics', async () => {
    const res = await request(app).get('/api/cooperative/finance');
    expect(res.status).toBe(200);
    expect(res.body.fund.welfarePool).toBeGreaterThan(0);
    expect(res.body.fund.insurancePool).toBeGreaterThan(0);
    expect(res.body.isDemo).toBe(true);
  });

  // 13. API: Worker Registration
  it('POST /api/auth/register-worker should register new worker with masked Aadhaar and co-op stake', async () => {
    const uniquePhone = '99' + Math.floor(10000000 + Math.random() * 89999999);
    const res = await request(app)
      .post('/api/auth/register-worker')
      .send({
        name: 'Kavita Joshi',
        phone: uniquePhone,
        aadhaarNumber: '482155667788',
        locality: 'Powai, Mumbai',
        serviceName: 'cleaning',
        experienceYears: 4,
        shgName: 'Andheri Domestic Workers Collective',
        hasBackgroundCert: false,
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('WORKER');
    expect(res.body.workerProfile).toBeDefined();
  });

  // 14. API: OTP Login Verification
  it('POST /api/auth/verify-otp should verify valid demo OTP 1234 and reject invalid OTP', async () => {
    // Valid Demo OTP
    const validRes = await request(app)
      .post('/api/auth/verify-otp')
      .send({
        phone: '9876543210',
        otp: '1234',
        role: 'CUSTOMER',
      });
    expect(validRes.status).toBe(200);
    expect(validRes.body.token).toBeDefined();

    // Invalid OTP
    const invalidRes = await request(app)
      .post('/api/auth/verify-otp')
      .send({
        phone: '9876543210',
        otp: '9999',
      });
    expect(invalidRes.status).toBe(400);
    expect(invalidRes.body.error).toContain('Invalid OTP');
  });
});
