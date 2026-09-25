import React, { useState } from 'react';
import { translations, Language } from '../i18n/translations';
import { WorkerProfile, Service } from '../types';
import { X, Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';

interface BookingModalProps {
  worker: WorkerProfile;
  service?: Service | null;
  lang: Language;
  onClose: () => void;
  onConfirmBooking: (bookingData: any) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  worker,
  service,
  lang,
  onClose,
  onConfirmBooking,
}) => {
  const t = translations[lang];
  const [scheduledDate, setScheduledDate] = useState<string>('Today');
  const [scheduledTime, setScheduledTime] = useState<string>('4:00 PM');
  const [serviceAddress, setServiceAddress] = useState<string>('B-402, Lake Homes, Powai, Mumbai - 400076');
  const [instructions, setInstructions] = useState<string>('Gate code 2214. Please ring the main buzzer.');

  const distanceKm = worker.aiMatch?.distanceKm || 0.6;
  const extraKm = Math.max(0, distanceKm - 1.0);
  const distanceFee = Math.round(extraKm * 20);
  const basePrice = worker.basePrice;
  const totalAmount = basePrice + distanceFee;
  const commissionPct = 10;
  const commissionAmount = Math.round((totalAmount * commissionPct) / 100);
  const workerEarning = totalAmount - commissionAmount;

  // Split cooperative commission
  const welfare = Math.round(commissionAmount * 0.30);
  const insurance = Math.round(commissionAmount * 0.30);
  const reinvestment = Math.round(commissionAmount * 0.20);
  const dividend = commissionAmount - welfare - insurance - reinvestment;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmBooking({
      workerId: worker.id,
      serviceId: service?.id || worker.primaryServiceId || worker.skills[0]?.service?.id,
      scheduledDate,
      scheduledTime,
      serviceAddress,
      instructions,
      basePrice,
      distanceKm,
      distanceFee,
      totalAmount,
      workerEarning,
      commissionAmount,
    });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card wide">
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-eyebrow">Fair &amp; Transparent Booking</div>
        <h2 className="modal-title">Confirm Service with {worker.user.name}</h2>
        <div style={{ fontSize: '13px', color: '#736b60', marginTop: '3px' }}>
          Verified Co-Owner · {worker.locality} · {worker.experienceYears} yrs experience
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Left: Schedule & Address */}
            <div>
              <div className="field" style={{ marginTop: 0 }}>
                <div className="field-label">
                  <Calendar size={14} color="var(--ink-teal)" />
                  <span>Scheduled Date <span className="req">*</span></span>
                </div>
                <select value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)}>
                  <option value="Today">Today (Immediate)</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="Day after Tomorrow">Day after Tomorrow</option>
                  <option value="Weekend Slot">Upcoming Weekend</option>
                </select>
              </div>

              <div className="field">
                <div className="field-label">
                  <Clock size={14} color="var(--ink-teal)" />
                  <span>Preferred Time Slot <span className="req">*</span></span>
                </div>
                <select value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)}>
                  <option value="10:00 AM">10:00 AM - 12:00 PM (Morning)</option>
                  <option value="2:00 PM">02:00 PM - 04:00 PM (Afternoon)</option>
                  <option value="4:00 PM">04:00 PM - 06:00 PM (Evening)</option>
                  <option value="6:30 PM">06:30 PM - 08:30 PM (Late Evening)</option>
                </select>
              </div>

              <div className="field">
                <div className="field-label">
                  <MapPin size={14} color="var(--ink-teal)" />
                  <span>Service Address <span className="req">*</span></span>
                </div>
                <input
                  type="text"
                  required
                  value={serviceAddress}
                  onChange={(e) => setServiceAddress(e.target.value)}
                  placeholder="House/Flat number, building, street, area"
                />
              </div>

              <div className="field">
                <div className="field-label">Notes or Gate Code <span className="opt-tag">Optional</span></div>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Ring bell twice, gate passcode"
                />
              </div>
            </div>

            {/* Right: Transparent Price Ledger */}
            <div
              style={{
                background: 'var(--paper)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid var(--thread)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontFamily: 'Rokkitt', fontWeight: 700, fontSize: '18px', color: 'var(--ink-teal-dark)' }}>
                  Where your money goes
                </div>
                <div style={{ fontSize: '11px', color: '#736b60', marginTop: '2px' }}>
                  No hidden platform markups. 100% transparent.
                </div>

                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Base Service Rate</span>
                    <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 600 }}>₹{basePrice}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#635b50' }}>
                    <span>Distance Top-Up ({distanceKm} km)</span>
                    <span style={{ fontFamily: 'IBM Plex Mono' }}>+₹{distanceFee}</span>
                  </div>

                  <div style={{ height: '1px', background: 'var(--thread)', margin: '4px 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '15px' }}>
                    <span>Customer Total</span>
                    <span style={{ fontFamily: 'IBM Plex Mono', color: 'var(--ink-teal)' }}>₹{totalAmount}</span>
                  </div>
                </div>

                {/* Cooperative Breakdown Card */}
                <div
                  style={{
                    background: 'var(--white)',
                    border: '1px solid var(--thread)',
                    borderRadius: '12px',
                    padding: '12px',
                    marginTop: '16px',
                    fontSize: '11.5px',
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--ink-teal)', marginBottom: '6px' }}>
                    Cooperative Split ({commissionPct}%):
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#554f46', marginBottom: '3px' }}>
                    <span>✓ Worker Direct Net Earning (90%)</span>
                    <strong>₹{workerEarning}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8a6215', marginBottom: '2px' }}>
                    <span>🛡️ Emergency Welfare Pool</span>
                    <span>₹{welfare}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8a6215', marginBottom: '2px' }}>
                    <span>🩺 Health &amp; Accident Insurance</span>
                    <span>₹{insurance}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8a6215', marginBottom: '2px' }}>
                    <span>🛠️ Collective Tools &amp; Reinvestment</span>
                    <span>₹{reinvestment}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8a6215' }}>
                    <span>📈 Member Year-End Dividend</span>
                    <span>₹{dividend}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-solid"
                style={{ width: '100%', marginTop: '20px', padding: '12px', fontSize: '14px' }}
              >
                Proceed to DEMO UPI Payment (₹{totalAmount}) →
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
