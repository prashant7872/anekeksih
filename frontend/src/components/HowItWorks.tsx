import React from 'react';
import { translations, Language } from '../i18n/translations';
import {
  UserCheck,
  ShieldCheck,
  CalendarCheck,
  Cpu,
  CheckCircle2,
  Banknote,
  HeartHandshake,
  ArrowDown,
} from 'lucide-react';

interface HowItWorksProps {
  lang: Language;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ lang }) => {
  const t = translations[lang];

  const steps = [
    {
      num: '01',
      icon: <UserCheck size={22} color="var(--ink-teal)" />,
      title: t.step1Title,
      desc: t.step1Desc,
    },
    {
      num: '02',
      icon: <ShieldCheck size={22} color="var(--ink-teal)" />,
      title: t.step2Title,
      desc: t.step2Desc,
    },
    {
      num: '03',
      icon: <CalendarCheck size={22} color="var(--ink-teal)" />,
      title: t.step3Title,
      desc: t.step3Desc,
    },
    {
      num: '04',
      icon: <Cpu size={22} color="var(--ink-teal)" />,
      title: t.step4Title,
      desc: t.step4Desc,
    },
    {
      num: '05',
      icon: <CheckCircle2 size={22} color="var(--ink-teal)" />,
      title: t.step5Title,
      desc: t.step5Desc,
    },
    {
      num: '06',
      icon: <Banknote size={22} color="var(--ink-teal)" />,
      title: t.step6Title,
      desc: t.step6Desc,
    },
    {
      num: '07',
      icon: <HeartHandshake size={22} color="var(--ink-teal)" />,
      title: t.step7Title,
      desc: t.step7Desc,
    },
  ];

  return (
    <section className="how-it-works" style={{ maxWidth: '1100px', margin: '40px auto 60px auto', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div className="services-label">Transparent Model (SIH 26089)</div>
        <h2 className="services-title" style={{ marginTop: '8px' }}>{t.howTitle}</h2>
        <div className="services-sub">{t.howSub}</div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '18px',
        }}
      >
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="step-card"
            style={{
              position: 'relative',
              background: 'var(--white)',
              border: '1px solid var(--thread)',
              borderRadius: '16px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span
                  style={{
                    fontFamily: 'IBM Plex Mono',
                    fontWeight: 700,
                    fontSize: '18px',
                    color: 'var(--turmeric)',
                  }}
                >
                  {s.num}
                </span>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'var(--paper)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {s.icon}
                </div>
              </div>

              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink-teal-dark)', marginBottom: '8px' }}>
                {s.title}
              </div>

              <div style={{ fontSize: '12px', color: '#736b60', lineHeight: '1.6' }}>
                {s.desc}
              </div>
            </div>

            {idx < steps.length - 1 && (
              <div
                style={{
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  color: 'var(--turmeric)',
                  fontFamily: 'IBM Plex Mono',
                  fontWeight: 600,
                }}
              >
                <span>NEXT STEP</span>
                <ArrowDown size={12} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
