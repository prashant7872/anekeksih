import React from 'react';
import { translations, Language } from '../i18n/translations';
import { Service } from '../types';

interface ServiceGridProps {
  services: Service[];
  lang: Language;
  onSelectService: (service: Service) => void;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({
  services,
  lang,
  onSelectService,
}) => {
  const t = translations[lang];

  return (
    <section className="services" id="servicesSection">
      <div className="services-head">
        <div className="services-label">{t.servicesLabel}</div>
        <h2 className="services-title">{t.servicesTitle}</h2>
        <div className="services-sub">{t.servicesSub}</div>
      </div>

      <div className="svc-grid">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="svc-card"
            onClick={() => onSelectService(svc)}
          >
            <span className="svc-emoji">{svc.emoji}</span>
            <div className="svc-name">{lang === 'hi' ? svc.titleHi : svc.titleEn}</div>
            <div className="svc-desc">{lang === 'hi' ? svc.descriptionHi : svc.descriptionEn}</div>
            
            <div className="svc-foot">
              <span className="tag co">🤝 {t.workerOwned}</span>
              <span className="svc-rate">₹{svc.baseRate}<span style={{ fontSize: '10px', color: '#9a917f' }}>/{svc.rateType.replace(/_/g, ' ')}</span></span>
            </div>

            {svc.isSpecialized && (
              <div style={{ marginTop: '8px' }}>
                <span className="tag warning">🛡️ Background Verified Mandatory</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
