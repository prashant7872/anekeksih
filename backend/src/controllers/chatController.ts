import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthenticatedRequest } from '../middleware/auth';

export async function getBookingChat(req: AuthenticatedRequest, res: Response) {
  const { bookingId } = req.params;

  try {
    let chat = await prisma.chat.findUnique({
      where: { bookingId },
      include: {
        booking: {
          include: {
            service: true,
            worker: { include: { user: { select: { id: true, name: true } } } },
            customer: { include: { user: { select: { id: true, name: true } } } },
          },
        },
        messages: {
          include: {
            sender: { select: { id: true, name: true, role: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!chat) {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          service: true,
          worker: { include: { user: { select: { id: true, name: true } } } },
          customer: { include: { user: { select: { id: true, name: true } } } },
        },
      });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      chat = await prisma.chat.create({
        data: { bookingId },
        include: {
          booking: {
            include: {
              service: true,
              worker: { include: { user: { select: { id: true, name: true } } } },
              customer: { include: { user: { select: { id: true, name: true } } } },
            },
          },
          messages: {
            include: {
              sender: { select: { id: true, name: true, role: true } },
            },
          },
        },
      });
    }

    return res.json({
      chat,
      privacyDisclaimer: 'Masked chat — phone numbers remain strictly private and protected.',
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to retrieve chat', details: error.message });
  }
}

export async function sendChatMessage(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { bookingId, message } = req.body;

  if (!bookingId || !message || !message.trim()) {
    return res.status(400).json({ error: 'bookingId and message content are required' });
  }

  try {
    let chat = await prisma.chat.findUnique({ where: { bookingId } });
    if (!chat) {
      chat = await prisma.chat.create({ data: { bookingId } });
    }

    const newMessage = await prisma.chatMessage.create({
      data: {
        chatId: chat.id,
        senderId: req.user.id,
        message: message.trim(),
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
    });

    return res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to send message', details: error.message });
  }
}
