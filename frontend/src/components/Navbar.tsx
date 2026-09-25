import React, { useState } from 'react';
import { translations, Language } from '../i18n/translations';
import { User } from '../types';
import { ShieldCheck, UserCheck, Globe, LogOut, ChevronDown } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  lang: Language;
  onToggleLang: () => void;
  onOpenAuth: (mode: 'login' | 'worker-signup' | 'provider-signup') => void;
  onQuickLogin: (role: string) => void;
  onLogout: () => void;
  onNavigate: (view: 'home' | 'services' | 'worker-dash' | 'customer-dash' | 'admin-dash') => void;
  onResetDemo: () => void;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  lang,
  onToggleLang,
  onOpenAuth,
  onQuickLogin,
  onLogout,
  onNavigate,
  onResetDemo,
  activeView,
}) => {
  const t = translations[lang];
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  return (
    <header className="nav">
      <div className="logo-wrap" onClick={() => onNavigate('home')}>
        <div className="logo">AnekEk</div>
        <span className="logo-sub">{t.coopSub}</span>
      </div>

      <div className="nav-actions">
        {/* Navigation Links */}
        <button
          className={`btn ${activeView === 'home' ? 'btn-ghost' : 'btn-ghost'}`}
          style={{ border: 'none', color: activeView === 'home' ? 'var(--ink-teal-dark)' : '#736b60' }}
          onClick={() => onNavigate('home')}
        >
          Home
        </button>

        <button
          className="btn btn-ghost"
          style={{ border: 'none', color: activeView === 'services' ? 'var(--ink-teal-dark)' : '#736b60' }}
          onClick={() => onNavigate('services')}
        >
          {t.bookService}
        </button>

        {/* Quick Demo Persona Switcher (Crucial for SIH Evaluator / Judge) */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-turmeric btn-sm"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            title="Easily switch between Worker, Customer, and Admin personas for testing"
          >
            <span>🎭 {t.switchRole}</span>
            <ChevronDown size={14} />
          </button>

          {showRoleMenu && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                background: 'var(--white)',
                border: '1.5px solid var(--thread)',
                borderRadius: '12px',
                padding: '8px',
                width: '230px',
                boxShadow: '0 12px 30px -10px rgba(0,0,0,0.2)',
                zIndex: 60,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ fontSize: '10px', fontFamily: 'IBM Plex Mono', color: '#9a917f', padding: '4px 8px' }}>
                QUICK DEMO PERSONAS
              </div>
              <button
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                onClick={() => {
                  onQuickLogin('WORKER');
                  setShowRoleMenu(false);
                }}
              >
                🧑‍🔧 <strong>Worker:</strong> Rekha Sharma
              </button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                onClick={() => {
                  onQuickLogin('CUSTOMER');
                  setShowRoleMenu(false);
                }}
              >
                🏠 <strong>Customer:</strong> Priya Sharma
              </button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                onClick={() => {
                  onQuickLogin('PLATFORM_ADMIN');
                  setShowRoleMenu(false);
                }}
              >
                🛡️ <strong>Admin:</strong> Federation Board
              </button>

              <div style={{ height: '1px', background: 'var(--thread)', margin: '4px 0' }} />

              <div style={{ fontSize: '9.5px', color: '#8a6215', padding: '4px 8px', lineHeight: '1.4' }}>
                🔑 Demo OTP: <strong>1234</strong>
                <br />
                Worker: worker@anekek.demo
                <br />
                Customer: customer@anekek.demo
              </div>

              <button
                className="btn btn-ghost btn-sm"
                style={{
                  justifyContent: 'center',
                  textAlign: 'center',
                  background: 'rgba(168, 80, 58, 0.08)',
                  color: 'var(--clay)',
                  border: '1px dashed var(--clay)',
                  marginTop: '4px',
                }}
                onClick={() => {
                  onResetDemo();
                  setShowRoleMenu(false);
                }}
              >
                ↺ Reset Demo Data
              </button>
            </div>
          )}
        </div>

        {/* Multilingual Toggle */}
        <button className="btn btn-ghost" onClick={onToggleLang} title="Toggle Hindi / English">
          <Globe size={14} />
          <span>{lang === 'en' ? '🌐 HI' : '🌐 EN'}</span>
        </button>

        {/* User state buttons */}
        {user ? (
          <>
            <button
              className="btn btn-solid"
              onClick={() => {
                if (user.role === 'WORKER') onNavigate('worker-dash');
                else if (user.role === 'CUSTOMER') onNavigate('customer-dash');
                else onNavigate('admin-dash');
              }}
            >
              <UserCheck size={14} />
              <span>
                {user.role === 'WORKER'
                  ? `Hi, ${user.name.split(' ')[0]} (Worker)`
                  : user.role === 'CUSTOMER'
                  ? `Hi, ${user.name.split(' ')[0]} (Customer)`
                  : `Admin: ${user.name.split(' ')[0]}`}
              </span>
            </button>
            <button className="btn btn-ghost btn-sm" onClick={onLogout} title="Log Out">
              <LogOut size={14} />
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-ghost" onClick={() => onOpenAuth('login')}>
              {t.login}
            </button>
            <button className="btn btn-solid" onClick={() => onOpenAuth('worker-signup')}>
              {t.joinWorker}
            </button>
          </>
        )}
      </div>
    </header>
  );
};
