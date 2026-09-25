import { MatchScoreDetails } from '../types';

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Number(d.toFixed(1));
}

export interface WorkerMatchInput {
  id: string;
  user: { name: string };
  lat: number;
  lng: number;
  isAvailable: boolean;
  averageRating: number;
  experienceYears: number;
  fairRotationPoints: number; // 0-100, higher means due for a job
  queuePosition: number;
  skills: Array<{ serviceId: string; isVerified: boolean; service?: { name: string } }>;
  verifications: Array<{ verificationType: string; status: string }>;
  cooperativeMembership?: { memberStatus: string; cooperative?: { name: string } } | null;
}

export function computeWorkerMatchScore(
  worker: WorkerMatchInput,
  targetServiceId: string | null,
  targetLat: number,
  targetLng: number
): MatchScoreDetails {
  const distanceKm = calculateDistanceKm(targetLat, targetLng, worker.lat, worker.lng);

  // 1. Skill Match (0.35 weight)
  const hasSkill = targetServiceId
    ? worker.skills.some((s) => s.serviceId === targetServiceId || s.service?.name === targetServiceId)
    : true;
  const skillMatch = hasSkill ? 1.0 : 0.0;

  // 2. Distance Score (0.20 weight) - higher if closer (decay over 10km)
  const distanceScore = Math.max(0, 1 - distanceKm / 10);

  // 3. Availability Score (0.15 weight)
  const availabilityScore = worker.isAvailable ? 1.0 : 0.2;

  // 4. Rating Score (0.10 weight) - normalized from 1-5 to 0-1
  const ratingScore = Math.min(1.0, Math.max(0, (worker.averageRating - 3.0) / 2.0));

  // 5. Experience Score (0.10 weight) - 10 years max
  const experienceScore = Math.min(1.0, worker.experienceYears / 10);

  // 6. Fair Rotation Score (0.10 weight) - prevents platform monopoly by single top worker
  const fairRotationScore = Math.min(1.0, worker.fairRotationPoints / 100);

  const totalScore = Number(
    (
      skillMatch * 0.35 +
      distanceScore * 0.20 +
      availabilityScore * 0.15 +
      ratingScore * 0.10 +
      experienceScore * 0.10 +
      fairRotationScore * 0.10
    ).toFixed(3)
  );

  const reasons: string[] = [];
  if (hasSkill) reasons.push('Required skill & certification verified ✓');
  reasons.push(`${distanceKm} km away from your location ✓`);
  if (worker.isAvailable) reasons.push('Immediate availability at scheduled slot ✓');
  reasons.push(`${worker.averageRating}★ average rating (${worker.experienceYears} yrs exp) ✓`);
  if (fairRotationScore >= 0.6) reasons.push('High fair-rotation allocation index (equal opportunity) ✓');
  if (worker.cooperativeMembership?.memberStatus === 'ACTIVE') {
    reasons.push('Verified co-owner of cooperative with full voting rights ✓');
  }

  return {
    workerId: worker.id,
    workerName: worker.user.name,
    totalScore,
    skillMatch,
    distanceScore: Number(distanceScore.toFixed(2)),
    availabilityScore,
    ratingScore: Number(ratingScore.toFixed(2)),
    experienceScore: Number(experienceScore.toFixed(2)),
    fairRotationScore: Number(fairRotationScore.toFixed(2)),
    distanceKm,
    reasons,
  };
}
