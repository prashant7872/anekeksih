import React, { useState } from 'react';
import { translations, Language } from '../i18n/translations';
import { MapPin, Navigation, Sparkles } from 'lucide-react';

interface HeroProps {
  lang: Language;
  onSearchLocation: (location: string) => void;
  onBookService: () => void;
  onJoinWorker: () => void;
  onShowToast: (msg: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  onSearchLocation,
  onBookService,
  onJoinWorker,
  onShowToast,
}) => {
  const t = translations[lang];
  const [locationInput, setLocationInput] = useState('');
  const [showRadar, setShowRadar] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const handleSearch = () => {
    const loc = locationInput.trim() || 'Powai, Mumbai';
    onSearchLocation(loc);
    setShowRadar(true);
    onShowToast(`Showing verified services near ${loc}`);
  };

  const handleLiveLocation = () => {
    setIsLocating(true);
    onShowToast(t.locatingGps);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          const locStr = `Powai, Mumbai (${pos.coords.latitude.toFixed(2)}°N, ${pos.coords.longitude.toFixed(2)}°E)`;
          setLocationInput(locStr);
          setShowRadar(true);
          onSearchLocation(locStr);
          onShowToast(t.gpsSuccess);
        },
        () => {
          // Graceful simulated fallback
          setTimeout(() => {
            setIsLocating(false);
            const fallbackLoc = 'Powai, Mumbai (Live GPS)';
            setLocationInput(fallbackLoc);
            setShowRadar(true);
            onSearchLocation(fallbackLoc);
            onShowToast(t.gpsSuccess);
          }, 600);
        }
      );
    } else {
      setTimeout(() => {
        setIsLocating(false);
        setLocationInput('Powai, Mumbai (Live GPS)');
        setShowRadar(true);
        onSearchLocation('Powai, Mumbai');
        onShowToast(t.gpsSuccess);
      }, 500);
    }
  };

  return (
    <section className="hero">
      <div className="hero-stamp">
        AnekEk<br />Verified<br />Cooperative
      </div>

      <div className="hero-eyebrow">{t.eyebrow}</div>

      <h1 className="hero-quote">
        "Fair for the hands that <span>work.</span>
        <br />
        Trusted by the homes that call."
      </h1>

      <p className="hero-sub">{t.heroSub}</p>

      <div className="hero-ctas">
        <button className="btn btn-solid" style={{ padding: '13px 28px', fontSize: '14px' }} onClick={onBookService}>
          {t.bookService}
        </button>
        <button className="btn btn-ghost" style={{ padding: '13px 28px', fontSize: '14px' }} onClick={onJoinWorker}>
          {t.joinWorker}
        </button>
      </div>

      <div className="hero-search">
        <div className="hero-search-input">
          <MapPin size={18} color="var(--ink-teal)" />
          <input
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={t.enterLocation}
          />
        </div>
        <button className="btn btn-solid" onClick={handleSearch}>
          🔍 {t.findServices}
        </button>
        <button className="btn btn-turmeric" onClick={handleLiveLocation} disabled={isLocating}>
          <Navigation size={15} />
          {isLocating ? 'Locating...' : t.useLiveLocation}
        </button>
      </div>

      {/* Geolocation radar mockup */}
      {showRadar && (
        <div className="geo-card" id="geoCard">
          <div className="geo-card-head">
            <div className="geo-card-title">Matched by exact distance & fair rotation</div>
            <span className="demo-badge">Verified · Near You</span>
          </div>

          <div className="geo-radar">
            <div className="geo-ring" style={{ width: '70px', height: '70px' }} />
            <div className="geo-ring" style={{ width: '140px', height: '140px' }} />
            <div className="geo-ring" style={{ width: '210px', height: '210px' }} />
            <div className="geo-pin-you">📍</div>

            <div className="geo-pin" style={{ top: '30%', left: '68%' }}>🧑‍🔧</div>
            <div className="geo-pin-label" style={{ top: '30%', left: '68%' }}>Rekha S. · 0.6km</div>

            <div className="geo-pin" style={{ top: '68%', left: '32%' }}>⚡</div>
            <div className="geo-pin-label" style={{ top: '68%', left: '32%' }}>Suresh Y. · 1.1km</div>

            <div className="geo-pin" style={{ top: '22%', left: '26%' }}>🧓</div>
            <div className="geo-pin-label" style={{ top: '22%', left: '26%' }}>Sunita V. · 1.8km</div>
          </div>

          <div className="geo-list">
            <div className="geo-list-item">
              <span>🧹 Rekha Sharma — Cleaning</span>
              <span className="geo-list-dist">0.6 km · ₹350 <span className="tag co">4.9★</span></span>
            </div>
            <div className="geo-list-item">
              <span>⚡ Suresh Yadav — Repairs & Wiring</span>
              <span className="geo-list-dist">1.1 km · ₹300 <span className="tag co">4.8★</span></span>
            </div>
            <div className="geo-list-item">
              <span>🧓 Sunita Verma — Elder Care</span>
              <span className="geo-list-dist">1.8 km · ₹500 <span style={{ color: 'var(--clay)', fontSize: '11px' }}>(+₹16 fair travel)</span></span>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: '#8a8172', marginTop: '12px', lineHeight: '1.6' }}>
            Pricing adjusts transparently with distance — workers travelling further receive a modest travel top-up, funded directly and not deducted from base pay.
          </div>
        </div>
      )}
    </section>
  );
};
