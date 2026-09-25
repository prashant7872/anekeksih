import React, { useState, useEffect } from 'react';
import { translations, Language } from '../i18n/translations';
import { Service, WorkerProfile } from '../types';
import { api } from '../services/api';
import { ShieldCheck, MapPin, Sparkles, Filter, X } from 'lucide-react';

interface WorkerDiscoveryModalProps {
  initialService?: Service | null;
  lang: Language;
  onClose: () => void;
  onSelectWorkerForBooking: (worker: WorkerProfile) => void;
  onOpenChatWithWorker: (worker: WorkerProfile) => void;
  onShowToast: (msg: string) => void;
}

export const WorkerDiscoveryModal: React.FC<WorkerDiscoveryModalProps> = ({
  initialService,
  lang,
  onClose,
  onSelectWorkerForBooking,
  onOpenChatWithWorker,
  onShowToast,
}) => {
  const t = translations[lang];
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>(initialService?.name || '');
  const [sortBy, setSortBy] = useState<string>('ai_match');
  const [maxDistance, setMaxDistance] = useState<string>('15');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    loadWorkers();
  }, [selectedService, sortBy, maxDistance]);

  const loadServices = async () => {
    try {
      const res = await api.getServices();
      setServices(res.services);
    } catch (err) {
      console.error(err);
    }
  };

  const loadWorkers = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        sortBy,
        maxDistance,
      };
      if (selectedService) params.service = selectedService;
      const res = await api.getWorkers(params);
      setWorkers(res.workers);
    } catch (err: any) {
      onShowToast(`Failed to load workers: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card wide">
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-eyebrow">AnekEk Cooperative Discovery</div>
        <h2 className="modal-title">Verified Local Worker-Owners</h2>
        <p style={{ fontSize: '13px', color: '#736b60', marginTop: '4px' }}>
          Matched via transparent AI combining verified skills, distance, and fair rotation.
        </p>

        {/* Filter & Sort Bar */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            margin: '20px 0',
            flexWrap: 'wrap',
            alignItems: 'center',
            background: 'var(--paper)',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid var(--thread)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600 }}>
            <Filter size={15} color="var(--ink-teal)" />
            <span>Filter:</span>
          </div>

          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--thread)', fontSize: '12.5px', background: 'var(--white)' }}
          >
            <option value="">All Services</option>
            {services.map((s) => (
              <option key={s.id} value={s.name}>
                {s.emoji} {lang === 'hi' ? s.titleHi : s.titleEn}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--thread)', fontSize: '12.5px', background: 'var(--white)' }}
          >
            <option value="ai_match">⚡ AI Smart Match (Skill + Distance + Rotation)</option>
            <option value="rating">⭐ Highest Rated</option>
            <option value="distance">📍 Closest Distance</option>
            <option value="price_low">₹ Lowest Base Price</option>
          </select>

          <select
            value={maxDistance}
            onChange={(e) => setMaxDistance(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--thread)', fontSize: '12.5px', background: 'var(--white)' }}
          >
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
            <option value="20">Within 20 km</option>
          </select>
        </div>

        {/* Worker Cards List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#9a917f' }}>
            Finding and ranking verified co-owners...
          </div>
        ) : workers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#9a917f' }}>
            No verified workers found for this criteria. Try expanding the distance radius.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '55vh', overflowY: 'auto' }}>
            {workers.map((w) => {
              const initials = w.user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2);

              return (
                <div
                  key={w.id}
                  style={{
                    border: '1.5px solid var(--thread)',
                    borderRadius: '14px',
                    padding: '18px',
                    background: 'var(--white)',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {/* Photo/Avatar */}
                    <div
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '12px',
                        background: 'var(--turmeric-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Rokkitt',
                        fontWeight: 700,
                        fontSize: '20px',
                        color: 'var(--ink-teal-dark)',
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: '220px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: '16px' }}>{w.user.name}</span>
                        <span style={{ fontSize: '12px', color: '#8a6215', fontWeight: 600 }}>
                          ⭐ {w.averageRating}★ ({w.completedJobsCount} jobs)
                        </span>
                        <span className="demo-badge">Demo Profile</span>
                      </div>

                      <div style={{ fontSize: '12px', color: '#736b60', marginTop: '3px' }}>
                        {w.experienceYears} years experience · {w.locality}
                      </div>

                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                        <span className="tag co">🤝 Worker-Owned ({(w.ownershipShare * 100).toFixed(1)}% stake)</span>
                        <span className="tag" style={{ background: 'rgba(28,75,68,0.07)' }}>
                          📍 {w.aiMatch?.distanceKm || 1.0} km away
                        </span>
                        <span className="tag verified">🛡️ Aadhaar e-KYC</span>
                        {w.cooperativeMembership?.shgAffiliation && (
                          <span className="tag">🏛️ {w.cooperativeMembership.shgAffiliation}</span>
                        )}
                      </div>

                      {/* AI Explainable Box */}
                      {w.aiMatch && (
                        <div
                          style={{
                            background: 'rgba(28, 75, 68, 0.04)',
                            borderLeft: '3px solid var(--ink-teal)',
                            borderRadius: '0 8px 8px 0',
                            padding: '8px 12px',
                            marginTop: '10px',
                            fontSize: '11px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: 'var(--ink-teal)', marginBottom: '3px' }}>
                            <Sparkles size={12} />
                            <span>Why this worker? (AI Match Score: {(w.aiMatch.totalScore * 100).toFixed(0)}%)</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', color: '#554f46' }}>
                            {w.aiMatch.reasons.map((r, i) => (
                              <div key={i}>{r}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price and CTA */}
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', minHeight: '90px' }}>
                      <div>
                        <div style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700, fontSize: '18px', color: 'var(--ink-teal)' }}>
                          ₹{w.basePrice}
                        </div>
                        <div style={{ fontSize: '10px', color: '#9a917f' }}>per visit base</div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => onOpenChatWithWorker(w)}>
                          💬 Chat
                        </button>
                        <button className="btn btn-solid btn-sm" onClick={() => onSelectWorkerForBooking(w)}>
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
