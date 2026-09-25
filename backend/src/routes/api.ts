import { Router } from 'express';
import {
  requestOtp,
  verifyOtp,
  demoQuickLogin,
  getCurrentUser,
  registerWorker,
} from '../controllers/authController';
import { getServices, getServiceDetails } from '../controllers/serviceController';
import {
  getWorkers,
  getWorkerById,
  updateWorkerAvailability,
} from '../controllers/workerController';
import {
  createBooking,
  updateBookingStatus,
  getBookings,
  getBookingById,
} from '../controllers/bookingController';
import { processDemoPayment, getPaymentDetails } from '../controllers/paymentController';
import { submitRating, getWorkerRatings } from '../controllers/ratingController';
import {
  getCooperativeFinance,
  getVoteProposals,
  castVote,
  getIdeas,
  createIdea,
  supportIdea,
} from '../controllers/cooperativeController';
import { getBookingChat, sendChatMessage } from '../controllers/chatController';
import {
  getAdminAnalytics,
  updateVerificationStatus,
  createDispute,
  updateDisputeStatus,
  getNotifications,
  markNotificationsAsRead,
  resetDemoData,
} from '../controllers/adminController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// ============ AUTH ============
router.post('/auth/request-otp', requestOtp);
router.post('/auth/verify-otp', verifyOtp);
router.post('/auth/demo-login', demoQuickLogin);
router.get('/auth/me', authenticateToken, getCurrentUser);
router.post('/auth/register-worker', registerWorker);

// ============ SERVICES ============
router.get('/services', getServices);
router.get('/services/:id', getServiceDetails);

// ============ WORKERS ============
router.get('/workers', getWorkers);
router.get('/workers/:id', getWorkerById);
router.post('/workers/me/availability', authenticateToken, updateWorkerAvailability);

// ============ BOOKINGS ============
router.post('/bookings', authenticateToken, createBooking);
router.get('/bookings', authenticateToken, getBookings);
router.get('/bookings/:id', authenticateToken, getBookingById);
router.patch('/bookings/:id/status', authenticateToken, updateBookingStatus);

// ============ PAYMENTS ============
router.post('/payments/demo', authenticateToken, processDemoPayment);
router.get('/payments/:id', authenticateToken, getPaymentDetails);

// ============ RATINGS ============
router.post('/ratings', authenticateToken, submitRating);
router.get('/workers/:id/ratings', getWorkerRatings);

// ============ COOPERATIVE GOVERNANCE & FINANCE ============
router.get('/cooperative/finance', getCooperativeFinance);
router.get('/cooperative/votes', authenticateToken, getVoteProposals);
router.post('/cooperative/votes/:id/cast', authenticateToken, castVote);
router.get('/cooperative/ideas', getIdeas);
router.post('/cooperative/ideas', authenticateToken, createIdea);
router.post('/cooperative/ideas/:id/support', authenticateToken, supportIdea);

// ============ CHAT ============
router.get('/chats/:bookingId', authenticateToken, getBookingChat);
router.post('/chats/send', authenticateToken, sendChatMessage);

// ============ ADMIN & NOTIFICATIONS ============
router.get('/admin/analytics', getAdminAnalytics);
router.patch('/admin/verifications/:id', authenticateToken, updateVerificationStatus);
router.post('/admin/disputes', authenticateToken, createDispute);
router.patch('/admin/disputes/:id', authenticateToken, updateDisputeStatus);
router.get('/notifications', authenticateToken, getNotifications);
router.post('/notifications/read-all', authenticateToken, markNotificationsAsRead);
router.post('/admin/reset-demo', resetDemoData);

export default router;
