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

export interface PriceBreakdown {
  basePrice: number;
  distanceKm: number;
  distanceFee: number;
  totalAmount: number;
  workerEarning: number;
  commissionAmount: number;
  commissionPct: number;
  cooperativeShare: {
    welfare: number;
    insurance: number;
    reinvestment: number;
    dividend: number;
  };
}

export interface MatchScoreDetails {
  workerId: string;
  workerName: string;
  totalScore: number;
  skillMatch: number;
  distanceScore: number;
  availabilityScore: number;
  ratingScore: number;
  experienceScore: number;
  fairRotationScore: number;
  distanceKm: number;
  reasons: string[];
}
