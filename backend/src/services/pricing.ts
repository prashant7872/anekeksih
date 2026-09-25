import { PriceBreakdown } from '../types';

export function calculatePricing(
  basePrice: number,
  distanceKm: number = 1.0,
  commissionPct: number = 10.0
): PriceBreakdown {
  // Fair travel adjustment: if distance > 1km, add ₹20 per additional km
  const extraKm = Math.max(0, distanceKm - 1.0);
  const distanceFee = Math.round(extraKm * 20);
  
  const totalAmount = basePrice + distanceFee;
  const commissionAmount = Math.round((totalAmount * commissionPct) / 100);
  const workerEarning = totalAmount - commissionAmount;

  // Split cooperative commission transparently (30/30/20/20)
  const welfare = Math.round(commissionAmount * 0.30);
  const insurance = Math.round(commissionAmount * 0.30);
  const reinvestment = Math.round(commissionAmount * 0.20);
  const dividend = commissionAmount - welfare - insurance - reinvestment;

  return {
    basePrice,
    distanceKm: Number(distanceKm.toFixed(1)),
    distanceFee,
    totalAmount,
    workerEarning,
    commissionAmount,
    commissionPct,
    cooperativeShare: {
      welfare,
      insurance,
      reinvestment,
      dividend,
    },
  };
}
