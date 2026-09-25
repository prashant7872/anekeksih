import React from 'react';
import { translations, Language } from '../i18n/translations';

interface StatStripProps {
  lang: Language;
}

export const StatStrip: React.FC<StatStripProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="stat-strip">
        <div className="stat">
          <div className="num">1,240+</div>
          <div className="lbl">{t.statWorkers}</div>
        </div>
        <div className="stat">
          <div className="num">42+</div>
          <div className="lbl">{t.statCollectives}</div>
        </div>
        <div className="stat">
          <div className="num">10%</div>
          <div className="lbl">{t.statCommission}</div>
        </div>
        <div className="stat">
          <div className="num">Mumbai</div>
          <div className="lbl">{t.statCities}</div>
        </div>
      </div>
      <div style={{ marginTop: '8px' }}>
        <span className="demo-badge">Demo data · Simulated federation metrics</span>
      </div>
    </div>
  );
};
