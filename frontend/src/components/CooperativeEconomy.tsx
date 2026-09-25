import React, { useState } from 'react';
import { translations, Language } from '../i18n/translations';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface CooperativeEconomyProps {
  lang: Language;
}

export const CooperativeEconomy: React.FC<CooperativeEconomyProps> = ({ lang }) => {
  const t = translations[lang];
  const [bookingAmount, setBookingAmount] = useState<number>(500);
  const [commissionPct, setCommissionPct] = useState<number>(10);

  const coopShare = Math.round((bookingAmount * commissionPct) / 100);
  const workerShare = bookingAmount - coopShare;

  const welfare = Math.round(coopShare * 0.30);
  const insurance = Math.round(coopShare * 0.30);
  const reinvestment = Math.round(coopShare * 0.20);
  const dividend = coopShare - welfare - insurance - reinvestment;

  const data = [
    { name: t.welfarePool, value: welfare, color: '#1C4B44', pct: '30%' },
    { name: t.insurancePool, value: insurance, color: '#D89B3C', pct: '30%' },
    { name: t.reinvestPool, value: reinvestment, color: '#A8503A', pct: '20%' },
    { name: t.dividendPool, value: dividend, color: '#EFC988', pct: '20%' },
  ];

  return (
    <section className="coop-section">
      <div className="coop-card">
        <div style={{ textAlign: 'center' }}>
          <div className="services-label">Cooperative Economics</div>
          <h2 className="services-title">{t.pricingTitle}</h2>
          <div className="services-sub">{t.pricingSub}</div>
        </div>

        <div className="coop-grid">
          {/* Left Column: Transparent Slider & Split */}
          <div className="price-split-visual">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '14px' }}>Sample Booking Amount:</span>
              <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700, fontSize: '18px', color: 'var(--ink-teal)' }}>
                ₹{bookingAmount}
              </span>
            </div>

            <input
              type="range"
              min="200"
              max="2000"
              step="50"
              value={bookingAmount}
              onChange={(e) => setBookingAmount(Number(e.target.value))}
              style={{ width: '100%', margin: '14px 0', accentColor: 'var(--ink-teal)' }}
            />

            <div className="split-bar">
              <div className="split-worker" style={{ width: `${100 - commissionPct}%` }}>
                ₹{workerShare} ({100 - commissionPct}%)
              </div>
              <div className="split-coop" style={{ width: `${commissionPct}%` }}>
                ₹{coopShare} ({commissionPct}%)
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '6px' }}>
              <div>
                <strong style={{ color: 'var(--ink-teal)' }}>{t.workerEarns}:</strong> ₹{workerShare}
              </div>
              <div>
                <strong style={{ color: '#8a6215' }}>{t.coopCommission}:</strong> ₹{coopShare}
              </div>
            </div>

            <div style={{ marginTop: '20px', padding: '12px', background: 'var(--white)', borderRadius: '10px', border: '1px solid var(--thread)', fontSize: '11.5px', color: '#635b50', lineHeight: '1.6' }}>
              💡 <em>Private platforms typically take 25%–35% with zero worker ownership. AnekEk caps federation commission at {commissionPct}%, and 100% of that share stays in member-governed funds.</em>
            </div>
          </div>

          {/* Right Column: Allocation Donut Chart */}
          <div>
            <div style={{ textAlign: 'center', marginBottom: '10px', fontSize: '13px', fontWeight: 700 }}>
              How the ₹{coopShare} Cooperative Share is Allocated:
            </div>

            <div style={{ height: '220px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any) => [`₹${val}`, name]}
                    contentStyle={{ background: 'var(--white)', borderRadius: '8px', border: '1px solid var(--thread)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', marginTop: '10px' }}>
              {data.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: item.color, flexShrink: 0 }} />
                  <span>{item.name}: <strong>₹{item.value}</strong> ({item.pct})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
