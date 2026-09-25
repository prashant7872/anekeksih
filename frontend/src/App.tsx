import React, { useState, useEffect } from 'react';
import './styles/anekek.css';
import { Language } from './i18n/translations';
import { User, Service, WorkerProfile, Booking } from './types';
import { api, removeAuthToken, setAuthToken } from './services/api';

// Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatStrip } from './components/StatStrip';
import { ServiceGrid } from './components/ServiceGrid';
import { HowItWorks } from './components/HowItWorks';
import { CooperativeEconomy } from './components/CooperativeEconomy';
import { WorkerDiscoveryModal } from './components/WorkerDiscoveryModal';
import { BookingModal } from './components/BookingModal';
import { DemoPaymentModal } from './components/DemoPaymentModal';
import { WorkerDashboard } from './components/WorkerDashboard';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ChatModal } from './components/ChatModal';
import { AuthModal } from './components/AuthModal';
import { RatingModal } from './components/RatingModal';
import { SmartMatchSection } from './components/SmartMatchSection';
import { Toast } from './components/Toast';

export const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(
    (localStorage.getItem('anekek_lang') as Language) || 'en'
  );
  const [user, setUser] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [activeView, setActiveView] = useState<
    'home' | 'services' | 'worker-dash' | 'customer-dash' | 'admin-dash'
  >('home');

  // Modals state
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'worker-signup' | 'provider-signup' }>({
    open: false,
    mode: 'login',
  });
  const [discoveryModal, setDiscoveryModal] = useState<{ open: boolean; service: Service | null }>({
    open: false,
    service: null,
  });
  const [bookingModal, setBookingModal] = useState<{ open: boolean; worker: WorkerProfile | null; service: Service | null }>({
    open: false,
    worker: null,
    service: null,
  });
  const [paymentModal, setPaymentModal] = useState<{ open: boolean; booking: any | null }>({
    open: false,
    booking: null,
  });
  const [ratingModal, setRatingModal] = useState<{ open: boolean; booking: Booking | null }>({
    open: false,
    booking: null,
  });
  const [chatModal, setChatModal] = useState<{ open: boolean; bookingId: string | null }>({
    open: false,
    bookingId: null,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // 1. Load Services
      const sRes = await api.getServices();
      setServices(sRes.services || []);

      // 2. Check if user already logged in, else login as default customer for instant seamless demo
      try {
        const uRes = await api.getMe();
        setUser(uRes.user);
      } catch (e) {
        // Auto demo quick login as Customer so judges can immediately interact
        const dRes = await api.demoLogin('CUSTOMER');
        setAuthToken(dRes.token);
        setUser(dRes.user);
      }
    } catch (err) {
      console.error('Initialization error:', err);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleToggleLang = () => {
    const next = lang === 'en' ? 'hi' : 'en';
    setLang(next);
    localStorage.setItem('anekek_lang', next);
    showToast(next === 'hi' ? 'भाषा बदलकर हिंदी कर दी गई है' : 'Language switched to English');
  };

  const handleQuickLogin = async (role: string) => {
    try {
      const res = await api.demoLogin(role);
      setAuthToken(res.token);
      setUser(res.user);
      showToast(`Switched to Demo Persona: ${res.user.name} (${role})`);

      if (role === 'WORKER') setActiveView('worker-dash');
      else if (role === 'CUSTOMER') setActiveView('customer-dash');
      else setActiveView('admin-dash');
    } catch (err: any) {
      showToast(err.message);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    setUser(null);
    setActiveView('home');
    showToast('Logged out successfully');
  };

  const handleSelectService = (service: Service) => {
    setDiscoveryModal({ open: true, service });
  };

  const handleSelectWorkerForBooking = (worker: WorkerProfile) => {
    setDiscoveryModal({ open: false, service: null });
    setBookingModal({ open: true, worker, service: discoveryModal.service });
  };

  const handleConfirmBooking = async (bookingData: any) => {
    try {
      showToast('Calculating transparent price & notifying worker...');
      const res = await api.createBooking(bookingData);
      setBookingModal({ open: false, worker: null, service: null });
      setPaymentModal({ open: true, booking: res.booking });
    } catch (err: any) {
      showToast(`Booking error: ${err.message}`);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentModal({ open: false, booking: null });
    setActiveView('customer-dash');
  };

  const handleResetDemo = async () => {
    try {
      showToast('Resetting demo database to clean Smart India Hackathon state...');
      await api.resetDemoData();
      await loadInitialData();
      showToast('Demo data reset successfully to initial state!');
    } catch (err: any) {
      showToast(`Reset error: ${err.message}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toast message={toastMessage} />

      <Navbar
        user={user}
        lang={lang}
        onToggleLang={handleToggleLang}
        onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
        onQuickLogin={handleQuickLogin}
        onLogout={handleLogout}
        onNavigate={setActiveView}
        onResetDemo={handleResetDemo}
        activeView={activeView}
      />

      <main style={{ flex: 1 }}>
        {/* ============ VIEW: HOME ============ */}
        {activeView === 'home' && (
          <>
            <Hero
              lang={lang}
              onSearchLocation={() => setDiscoveryModal({ open: true, service: null })}
              onBookService={() => {
                const el = document.getElementById('servicesSection');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onJoinWorker={() => setAuthModal({ open: true, mode: 'worker-signup' })}
              onShowToast={showToast}
            />

            <StatStrip lang={lang} />

            <ServiceGrid
              services={services}
              lang={lang}
              onSelectService={handleSelectService}
            />

            <SmartMatchSection
              lang={lang}
              services={services}
              onSelectWorkerForBooking={handleSelectWorkerForBooking}
              onShowToast={showToast}
            />

            <HowItWorks lang={lang} />

            <CooperativeEconomy lang={lang} />
          </>
        )}

        {/* ============ VIEW: SERVICES ============ */}
        {activeView === 'services' && (
          <div style={{ paddingTop: '20px' }}>
            <ServiceGrid
              services={services}
              lang={lang}
              onSelectService={handleSelectService}
            />
          </div>
        )}

        {/* ============ VIEW: WORKER DASHBOARD ============ */}
        {activeView === 'worker-dash' && user && (
          <WorkerDashboard
            user={user}
            lang={lang}
            onOpenChat={(bookingId) => setChatModal({ open: true, bookingId })}
            onShowToast={showToast}
          />
        )}

        {/* ============ VIEW: CUSTOMER DASHBOARD ============ */}
        {activeView === 'customer-dash' && user && (
          <CustomerDashboard
            user={user}
            lang={lang}
            onOpenChat={(bookingId) => setChatModal({ open: true, bookingId })}
            onOpenRatingModal={(booking) => setRatingModal({ open: true, booking })}
            onNavigateToServices={() => setActiveView('services')}
            onShowToast={showToast}
          />
        )}

        {/* ============ VIEW: ADMIN DASHBOARD ============ */}
        {activeView === 'admin-dash' && (
          <AdminDashboard lang={lang} onShowToast={showToast} />
        )}
      </main>

      {/* FOOTER */}
      <footer style={{ padding: '32px 48px', textAlign: 'center', borderTop: '1px dashed var(--thread)', fontSize: '12px', color: '#9a917f', background: 'var(--white)', marginTop: '40px' }}>
        <div style={{ fontFamily: 'Rokkitt', fontWeight: 700, fontSize: '18px', color: 'var(--ink-teal-dark)', marginBottom: '4px' }}>
          AnekEk
        </div>
        <div>
          Many hands. One shared future. &nbsp;·&nbsp; Smart India Hackathon 2026 (Problem 26089)
        </div>
        <div style={{ fontSize: '11px', marginTop: '6px', color: '#8a6215' }}>
          A worker-owned cooperative marketplace connecting households with verified local service providers.
        </div>
      </footer>

      {/* MODALS */}
      {authModal.open && (
        <AuthModal
          initialMode={authModal.mode}
          onClose={() => setAuthModal({ open: false, mode: 'login' })}
          onLoginSuccess={(u) => {
            setUser(u);
            if (u.role === 'WORKER') setActiveView('worker-dash');
            else if (u.role === 'CUSTOMER') setActiveView('customer-dash');
            else setActiveView('admin-dash');
          }}
          onShowToast={showToast}
        />
      )}

      {discoveryModal.open && (
        <WorkerDiscoveryModal
          initialService={discoveryModal.service}
          lang={lang}
          onClose={() => setDiscoveryModal({ open: false, service: null })}
          onSelectWorkerForBooking={handleSelectWorkerForBooking}
          onOpenChatWithWorker={async (w) => {
            // Find or simulate booking chat
            showToast(`Connecting to ${w.user.name} via masked chat`);
            setChatModal({ open: true, bookingId: 'BK-2026-9041' });
          }}
          onShowToast={showToast}
        />
      )}

      {bookingModal.open && bookingModal.worker && (
        <BookingModal
          worker={bookingModal.worker}
          service={bookingModal.service}
          lang={lang}
          onClose={() => setBookingModal({ open: false, worker: null, service: null })}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {paymentModal.open && paymentModal.booking && (
        <DemoPaymentModal
          booking={paymentModal.booking}
          lang={lang}
          onClose={() => setPaymentModal({ open: false, booking: null })}
          onPaymentSuccess={handlePaymentSuccess}
          onShowToast={showToast}
        />
      )}

      {ratingModal.open && ratingModal.booking && (
        <RatingModal
          booking={ratingModal.booking}
          onClose={() => setRatingModal({ open: false, booking: null })}
          onRatingSuccess={() => {
            showToast('Rating recorded and updated on worker profile!');
          }}
          onShowToast={showToast}
        />
      )}

      {chatModal.open && chatModal.bookingId && (
        <ChatModal
          bookingId={chatModal.bookingId}
          currentUser={user}
          onClose={() => setChatModal({ open: false, bookingId: null })}
          onShowToast={showToast}
        />
      )}
    </div>
  );
};
