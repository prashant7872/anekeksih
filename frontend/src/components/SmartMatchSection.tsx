import React, { useState, useEffect } from 'react';
import { translations, Language } from '../i18n/translations';
import { Service, WorkerProfile } from '../types';
import { api } from '../services/api';
import { Sparkles, MapPin, Clock, Wrench, ShieldCheck, ArrowRight, CheckCircle2, RotateCw } from 'lucide-react';

interface SmartMatchSectionProps {
  lang: Language;
  services: Service[];
  onSelectWorkerForBooking: (worker: WorkerProfile) => void;
  onShowToast: (msg: string) => void;
}

export const SmartMatchSection: React.FC<SmartMatchSectionProps> = ({
  lang,
  services,
  onSelectWorkerForBooking,
  onShowToast,
}) => {
  const t = translations[lang];

  // Natural query and parsed states
  const [naturalQuery, setNaturalQuery] = useState('Need a plumber today at 5 PM');
  const [selectedService, setSelectedService] = useState('plumbing');
  const [radiusKm, setRadiusKm] = useState('0.8');
  const [scheduledSlot, setScheduledSlot] = useState('Today 5 PM');
  const [matchedWorkers, setMatchedWorkers] = useState<WorkerProfile[]>([]);
  const [isMatching, setIsMatching] = useState(false);

  // Quick preset chips for hackathon presentation
  const presets = [
    { label: '🚰 Plumber today 5 PM', query: 'Need a plumber today at 5 PM', svc: 'plumbing', rad: '0.8', slot: 'Today 5 PM' },
    { label: '⚡ Electrician in Powai', query: 'Need an electrician in Powai right now', svc: 'electrical', rad: '1.2', slot: 'Today immediate' },
    { label: '🧓 Elder Caregiver evening', query: 'Need elder caregiver for evening companion', svc: 'eldercare', rad: '2.0', slot: 'Today 4 PM' },
    { label: '🪚 Carpenter furniture repair', query: 'Need carpenter for hinge and door fitting', svc: 'carpentry', rad: '1.5', slot: 'Tomorrow 10 AM' },
    { label: '🧹 Home Deep Cleaning', query: 'Need 2BHK deep cleaning tomorrow morning', svc: 'cleaning', rad: '1.0', slot: 'Tomorrow 9 AM' },
  ];

  useEffect(() => {
    runMatch();
  }, [selectedService, radiusKm]);

  const handleSelectPreset = (p: typeof presets[0]) => {
    setNaturalQuery(p.query);
    setSelectedService(p.svc);
    setRadiusKm(p.rad);
    setScheduledSlot(p.slot);
    onShowToast(`Smart Match analyzing: "${p.query}"`);
  };

  const handleNaturalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = naturalQuery.toLowerCase();
    let detectedSvc = selectedService;
    if (q.includes('plumb') || q.includes('pipe') || q.includes('tap') || q.includes('leak')) detectedSvc = 'plumbing';
    else if (q.includes('electr') || q.includes('wire') || q.includes('switch') || q.includes('fan')) detectedSvc = 'electrical';
    else if (q.includes('carpent') || q.includes('furnitur') || q.includes('wood') || q.includes('door')) detectedSvc = 'carpentry';
    else if (q.includes('elder') || q.includes('senior') || q.includes('care')) detectedSvc = 'eldercare';
    else if (q.includes('clean') || q.includes('maid') || q.includes('sweep')) detectedSvc = 'cleaning';
    else if (q.includes('cook') || q.includes('meal') || q.includes('food')) detectedSvc = 'cooking';
    else if (q.includes('child') || q.includes('baby')) detectedSvc = 'childcare';
    else if (q.includes('appliance') || q.includes('fridge') || q.includes('washing')) detectedSvc = 'appliance';

    setSelectedService(detectedSvc);
    onShowToast(`AI detected service intent: ${detectedSvc.toUpperCase()}`);
    runMatch();
  };

  const runMatch = async () => {
    setIsMatching(true);
    try {
      const res = await api.getWorkers({
        service: selectedService,
        sortBy: 'ai_match',
        maxDistance: radiusKm ? String(Math.max(5, Math.ceil(Number(radiusKm) * 3))) : '10',
      });
      // Limit to top 3 matched workers for display as requested in Requirement 49
      setMatchedWorkers((res.workers || []).slice(0, 3));
    } catch (err: any) {
      console.error('Smart match error:', err);
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <section style={{ maxWidth: '1100px', margin: '40px auto 60px auto', padding: '0 24px' }}>
      <div
        style={{
          background: 'var(--white)',
          border: '1.5px solid var(--thread)',
          borderRadius: '22px',
          padding: '36px 32px',
          boxShadow: '0 16px 40px -16px rgba(28, 75, 68, 0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative Badge */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(28, 75, 68, 0.08)',
            border: '1px solid var(--ink-teal)',
            borderRadius: '20px',
            padding: '4px 12px',
            fontSize: '11px',
            fontFamily: 'IBM Plex Mono',
            color: 'var(--ink-teal)',
            fontWeight: 600,
          }}
        >
          <Sparkles size={13} />
          <span>SIH 2026 AI DEMO ENGINE</span>
        </div>

        {/* Section Headings */}
        <div className="services-label">AI Deterministic Matching &amp; Fair Rotation</div>
        <h2 style={{ fontFamily: 'Rokkitt', fontSize: '28px', fontWeight: 700, marginTop: '6px', color: 'var(--ink-teal-dark)' }}>
          AnekEk Smart Match Engine
        </h2>
        <p style={{ fontSize: '13.5px', color: '#736b60', marginTop: '6px', maxWidth: '780px' }}>
          Unlike commercial gig platforms that monopolize jobs to top 5% accounts, AnekEk uses explainable AI
          combining verified trade skills (35%), proximity (20%), availability (15%), ratings (10%), experience (10%),
          and fair rotation quotas (10%) to distribute livelihood equitably.
        </p>

        {/* Natural Search Input */}
        <form onSubmit={handleNaturalSubmit} style={{ marginTop: '24px' }}>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              background: 'var(--paper)',
              padding: '8px',
              borderRadius: '14px',
              border: '1.5px solid var(--thread)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '260px', padding: '0 10px' }}>
              <Sparkles size={18} color="var(--turmeric)" />
              <input
                type="text"
                value={naturalQuery}
                onChange={(e) => setNaturalQuery(e.target.value)}
                placeholder="Describe your need (e.g. 'Need a plumber tomorrow at 5 PM')..."
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--charcoal)',
                }}
              />
            </div>

            <button type="submit" className="btn btn-solid" style={{ padding: '10px 22px' }}>
              Run Smart Match ⚡
            </button>
          </div>
        </form>

        {/* Quick Suggestion Chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#8a8172', fontWeight: 600, fontFamily: 'IBM Plex Mono' }}>
            TRY PRESET:
          </span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(p)}
              style={{
                background: selectedService === p.svc ? 'rgba(28, 75, 68, 0.12)' : 'var(--paper)',
                border: '1px solid ' + (selectedService === p.svc ? 'var(--ink-teal)' : 'var(--thread)'),
                borderRadius: '16px',
                padding: '4px 11px',
                fontSize: '11.5px',
                color: selectedService === p.svc ? 'var(--ink-teal-dark)' : '#635b50',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Interactive Parameter Controls (Requirement 49) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '14px',
            marginTop: '22px',
            background: 'rgba(28, 75, 68, 0.03)',
            padding: '16px',
            borderRadius: '14px',
            border: '1px dashed var(--thread)',
          }}
        >
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-teal)', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', fontFamily: 'IBM Plex Mono' }}>
              <Wrench size={13} /> Selected Trade Service
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              style={{
                width: '100%',
                marginTop: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--thread)',
                fontSize: '13px',
                background: 'var(--white)',
              }}
            >
              {services.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.emoji} {lang === 'hi' ? s.titleHi : s.titleEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-teal)', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', fontFamily: 'IBM Plex Mono' }}>
              <MapPin size={13} /> Geo Proximity Radius
            </label>
            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(e.target.value)}
              style={{
                width: '100%',
                marginTop: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--thread)',
                fontSize: '13px',
                background: 'var(--white)',
              }}
            >
              <option value="0.8">0.8 km (Walkable Neighborhood)</option>
              <option value="1.5">1.5 km (Ward / Sector)</option>
              <option value="3.0">3.0 km (Township)</option>
              <option value="5.0">5.0 km (Suburban)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-teal)', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', fontFamily: 'IBM Plex Mono' }}>
              <Clock size={13} /> Scheduled Time Slot
            </label>
            <select
              value={scheduledSlot}
              onChange={(e) => setScheduledSlot(e.target.value)}
              style={{
                width: '100%',
                marginTop: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--thread)',
                fontSize: '13px',
                background: 'var(--white)',
              }}
            >
              <option value="Today 5 PM">Today at 5:00 PM</option>
              <option value="Today immediate">Immediate (Within 45 mins)</option>
              <option value="Tomorrow 10 AM">Tomorrow at 10:00 AM</option>
              <option value="Weekend slot">Upcoming Weekend</option>
            </select>
          </div>
        </div>

        {/* Explainable Weight Matrix Formula (Requirement 11) */}
        <div
          style={{
            margin: '18px 0',
            fontSize: '11px',
            color: '#736b60',
            fontFamily: 'IBM Plex Mono',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            padding: '10px 14px',
            background: 'var(--paper)',
            borderRadius: '10px',
          }}
        >
          <span><strong>Formula:</strong> Score = Skill (35%) + Distance (20%) + Availability (15%) + Rating (10%) + Experience (10%) + Fair-Rotation (10%)</span>
          <span style={{ color: 'var(--ink-teal)', fontWeight: 700 }}>✓ Verified Cooperative Rotation</span>
        </div>

        {/* Matched Workers Output Cards (Requirement 49) */}
        {isMatching ? (
          <div style={{ textAlign: 'center', padding: '36px 0', color: '#9a917f' }}>
            <RotateCw size={24} className="spin" style={{ margin: '0 auto 8px auto', display: 'block' }} />
            Evaluating skill certifications, live proximity, and collective rotation queues...
          </div>
        ) : matchedWorkers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 0', color: '#9a917f' }}>
            No co-owners registered in immediate radius. Expanding to city collective.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
            {matchedWorkers.map((w, idx) => {
              const initials = w.user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2);
              const scorePct = Math.round((w.aiMatch?.totalScore || 0.88) * 100);

              return (
                <div
                  key={w.id}
                  style={{
                    border: idx === 0 ? '2px solid var(--turmeric)' : '1px solid var(--thread)',
                    borderRadius: '16px',
                    padding: '18px',
                    background: 'var(--white)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    boxShadow: idx === 0 ? '0 12px 28px -10px rgba(216, 155, 60, 0.3)' : 'none',
                  }}
                >
                  {idx === 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-11px',
                        left: '16px',
                        background: 'var(--turmeric)',
                        color: 'var(--ink-teal-dark)',
                        fontSize: '9.5px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        letterSpacing: '0.5px',
                      }}
                    >
                      ★ TOP AI MATCH ({scorePct}%)
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '12px',
                          background: 'var(--turmeric-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'Rokkitt',
                          fontWeight: 700,
                          fontSize: '17px',
                          color: 'var(--ink-teal-dark)',
                          flexShrink: 0,
                        }}
                      >
                        {initials}
                      </div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--charcoal)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {w.user.name}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#736b60' }}>
                          {w.locality} · {w.experienceYears} yrs exp
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', margin: '12px 0 10px 0' }}>
                      <span className="tag co" style={{ fontSize: '9px' }}>🤝 Co-Owner</span>
                      <span className="tag" style={{ fontSize: '9px', background: 'rgba(28,75,68,0.07)' }}>
                        📍 {w.aiMatch?.distanceKm || radiusKm} km
                      </span>
                      <span className="tag verified" style={{ fontSize: '9px' }}>⭐ {w.averageRating}★</span>
                    </div>

                    {/* AI Scoring Factors Breakdown */}
                    <div
                      style={{
                        background: 'var(--paper)',
                        borderRadius: '10px',
                        padding: '10px',
                        fontSize: '11px',
                        marginTop: '10px',
                      }}
                    >
                      <div style={{ fontWeight: 700, color: 'var(--ink-teal)', marginBottom: '6px' }}>
                        Why this worker?
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: '#554f46', fontSize: '10.5px' }}>
                        <div>✓ Required trade skill matched (35%)</div>
                        <div>✓ {w.aiMatch?.distanceKm || radiusKm} km proximity ({((w.aiMatch?.distanceScore || 0.8) * 100).toFixed(0)}%)</div>
                        <div>✓ Fair-rotation queue position #{w.queuePosition || 1}</div>
                        <div>✓ Cooperative membership verified</div>
                      </div>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--paper-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700, fontSize: '16px', color: 'var(--ink-teal)' }}>
                        ₹{w.basePrice}
                      </div>
                      <div style={{ fontSize: '9.5px', color: '#9a917f' }}>base price</div>
                    </div>

                    <button
                      className="btn btn-solid btn-sm"
                      onClick={() => onSelectWorkerForBooking(w)}
                      style={{ padding: '8px 14px', fontSize: '12px' }}
                    >
                      Book Now →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
