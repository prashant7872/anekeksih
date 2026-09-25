export type UserRole = 'CUSTOMER' | 'WORKER' | 'COOP_ADMIN' | 'PLATFORM_ADMIN';

export type BookingStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CONFIRMED'
  | 'ON_THE_WAY'
  | 'STARTED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  locale: string;
  workerProfile?: WorkerProfile;
  customerProfile?: CustomerProfile;
  notifications?: NotificationItem[];
}

export interface Service {
  id: string;
  name: string;
  titleEn: string;
  titleHi: string;
  emoji: string;
  category: string;
  baseRate: number;
  rateType: string;
  descriptionEn: string;
  descriptionHi: string;
  isSpecialized: boolean;
  _count?: { workers: number; bookings: number };
}

export interface WorkerProfile {
  id: string;
  userId: string;
  user: { id: string; name: string; phone: string };
  primaryServiceId?: string;
  primaryService?: Service;
  locality: string;
  city: string;
  lat: number;
  lng: number;
  experienceYears: number;
  basePrice: number;
  isAvailable: boolean;
  queuePosition: number;
  fairRotationPoints: number;
  ownershipShare: number;
  completedJobsCount: number;
  averageRating: number;
  ratingsCount: number;
  skills: Array<{ id: string; service: Service; experienceYrs: number; isVerified: boolean }>;
  verifications: Array<{ id: string; verificationType: string; status: string; documentMasked: string }>;
  cooperativeMembership?: {
    id: string;
    memberStatus: string;
    shgAffiliation?: string;
    cooperative: { id: string; name: string; commissionPct: number };
  };
  aiMatch?: {
    totalScore: number;
    skillMatch: number;
    distanceScore: number;
    availabilityScore: number;
    ratingScore: number;
    experienceScore: number;
    fairRotationScore: number;
    distanceKm: number;
    reasons: string[];
  };
}

export interface CustomerProfile {
  id: string;
  userId: string;
  user: { id: string; name: string; phone: string };
  locality: string;
  city: string;
  address?: string;
  lat: number;
  lng: number;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customer: { id: string; user: { name: string; phone: string } };
  workerId: string;
  worker: {
    id: string;
    user: { name: string; phone: string };
    cooperativeMembership?: { cooperative: { name: string } };
  };
  serviceId: string;
  service: Service;
  status: BookingStatus;
  scheduledDate: string;
  scheduledTime: string;
  serviceAddress: string;
  instructions?: string;
  basePrice: number;
  distanceKm: number;
  distanceFee: number;
  totalAmount: number;
  workerEarning: number;
  commissionAmount: number;
  commissionPct: number;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  reviews?: Array<{ id: string; rating: number; comment: string }>;
  chat?: { id: string };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface VoteProposal {
  id: string;
  title: string;
  tag: string;
  description: string;
  deadline: string;
  totalEligible: number;
  votesCastCount: number;
  hasVoted: boolean;
  userVotedOptionId?: string;
  options: Array<{
    id: string;
    label: string;
    voteCount: number;
    percentage: number;
  }>;
}

export interface IdeaItem {
  id: string;
  title: string;
  category: string;
  description: string;
  type: string;
  supportCount: number;
  status: string;
  author: { name: string; role: string };
  createdAt: string;
}
