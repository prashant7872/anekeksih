import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthenticatedRequest } from '../middleware/auth';
import { calculatePricing } from '../services/pricing';

export async function processDemoPayment(req: AuthenticatedRequest, res: Response) {
  const { bookingId, upiId = 'user@okhdfcbank', method = 'UPI' } = req.body;

  if (!bookingId) {
    return res.status(400).json({ error: 'bookingId is required' });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
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

    const transactionRef = `UPI-DEMO-${Date.now().toString().slice(-8)}`;

    // Create Payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        transactionRef,
        amount: booking.totalAmount,
        method,
        upiId,
        status: 'SUCCESS',
        isDemo: true,
        transactions: {
          create: [
            {
              type: 'CUSTOMER_PAYMENT',
              amount: booking.totalAmount,
              description: `Customer paid ₹${booking.totalAmount} for #${booking.bookingNumber}`,
            },
            {
              type: 'WORKER_CREDIT',
              amount: booking.workerEarning,
              description: `Worker credited base earning ₹${booking.workerEarning}`,
            },
            {
              type: 'COOP_COMMISSION',
              amount: booking.commissionAmount,
              description: `Cooperative retained ${booking.commissionPct}% commission (₹${booking.commissionAmount})`,
            },
          ],
        },
      },
      include: { transactions: true },
    });

    // Update booking payment status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: 'COMPLETED',
        paymentMethod: method,
        status: booking.status === 'REQUESTED' ? 'CONFIRMED' : booking.status,
      },
    });

    // Notify worker
    await prisma.notification.create({
      data: {
        userId: booking.worker.userId,
        title: 'Payment Received (DEMO)',
        message: `₹${booking.totalAmount} paid for Booking #${booking.bookingNumber}. Net ₹${booking.workerEarning} will settle upon completion.`,
        type: 'PAYMENT',
      },
    });

    return res.json({
      success: true,
      payment,
      booking: updatedBooking,
      message: 'Demo payment processed successfully.',
      disclaimer: 'DEMO TRANSACTION — NO REAL MONEY TRANSFERRED',
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Payment processing failed', details: error.message });
  }
}

export async function getPaymentDetails(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;

  try {
    const payment = await prisma.payment.findFirst({
      where: {
        OR: [{ id }, { bookingId: id }, { transactionRef: id }],
      },
      include: {
        booking: {
          include: {
            service: true,
            worker: { include: { user: true } },
            customer: { include: { user: true } },
          },
        },
        transactions: true,
      },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    return res.json({ payment });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch payment', details: error.message });
  }
}
