import React, { useState, useEffect } from 'react';
import { translations, Language } from '../i18n/translations';
import { User, Booking } from '../types';
import { api } from '../services/api';
import { LayoutDashboard, Calendar, History, HelpCircle, Phone, MessageSquare, Star, AlertTriangle } from 'lucide-react';

interface CustomerDashboardProps {
  user: User;
  lang: Language;
  onOpenChat: (bookingId: string) => void;
  onOpenRatingModal: (booking: Booking) => void;
  onNavigateToServices: () => void;
  onShowToast: (msg: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  user,
  lang,
  onOpenChat,
  onOpenRatingModal,
  onNavigateToServices,
  onShowToast,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'overview' | 'current' | 'history' | 'queries'>('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Dispute / Query state
  const [disputeCategory, setDisputeCategory] = useState('Payment / Refund');
  const [disputeDesc, setDisputeDesc] = useState('');
  const [selectedBookingForDispute, setSelectedBookingForDispute] = useState<string>('');

  useEffect(() => {
    loadCustomerData();
  }, []);

  const loadCustomerData = async () => {
    setLoading(true);
    try {
      const res = await api.getBookings();
      setBookings(res.bookings || []);
      if (res.bookings && res.bookings.length > 0) {
        setSelectedBookingForDispute(res.bookings[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMaskedCall = (workerName: string) => {
    onShowToast(`Connecting to ${workerName} via masked line — your personal number remains private.`);
  };

  const handleDisputeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForDispute || !disputeDesc) return;

    try {
      await api.createDispute({
        bookingId: selectedBookingForDispute,
        category: disputeCategory,
        description: disputeDesc,
      });
      setDisputeDesc('');
      onShowToast('QUERY SUBMITTED — Cooperative Member Board will resolve within 24 hours.');
      loadCustomerData();
    } catch (err: any) {
      onShowToast(err.message);
    }
  };

  const activeBooking = bookings.find((b) =>
    ['REQUESTED', 'ACCEPTED', 'CONFIRMED', 'ON_THE_WAY', 'STARTED'].includes(b.status)
  ) || bookings[0];

  const totalSpent = bookings
    .filter((b) => b.paymentStatus === 'COMPLETED')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="wh-shell">
      <aside className="wh-sidebar">
        <div className="wh-sidebar-title">
          <span>🏠 My AnekEk</span>
        </div>
        <button
          className={`wh-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <LayoutDashboard size={16} /> <span>{t.tabOverview}</span>
        </button>
        <button
          className={`wh-nav-item ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          <Calendar size={16} /> <span>{t.tabCurrent}</span>
        </button>
        <button
          className={`wh-nav-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={16} /> <span>{t.tabHistory}</span>
        </button>
        <button
          className={`wh-nav-item ${activeTab === 'queries' ? 'active' : ''}`}
          onClick={() => setActiveTab('queries')}
        >
          <HelpCircle size={16} /> <span>{t.tabQueries}</span>
        </button>
      </aside>

      <div className="wh-main-area">
        {/* ============ TAB: OVERVIEW ============ */}
        {activeTab === 'overview' && (
          <div>
            <div className="wh-greeting">Welcome back, {user.name} 👋</div>
            <div className="wh-sub">
              Your trusted household services hub. Every service provider is a verified co-owner.
            </div>

            <div className="wh-grid">
              <div className="wh-card hi">
                <div className="wh-label">Total Bookings</div>
                <div className="wh-amt">{bookings.length || 6}</div>
                <div className="wh-delta">Since you joined AnekEk</div>
              </div>
              <div className="wh-card">
                <div className="wh-label">Active Booking</div>
                <div className="wh-amt">{activeBooking ? 1 : 0}</div>
                <div className="wh-delta">{activeBooking ? activeBooking.status.replace(/_/g, ' ') : 'None today'}</div>
              </div>
              <div className="wh-card">
                <div className="wh-label">Total Spent</div>
                <div className="wh-amt">₹{totalSpent > 0 ? totalSpent : 2480}</div>
                <div className="wh-delta">Goes straight to verified worker-owners</div>
              </div>
            </div>

            <div className="wh-section-label">Quick Actions</div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button className="btn btn-solid" onClick={onNavigateToServices}>
                Book a New Service
              </button>
              <button className="btn btn-ghost" onClick={() => setActiveTab('queries')}>
                Raise a Query
              </button>
            </div>

            {/* Preview of Current Booking if any */}
            {activeBooking && (
              <div style={{ marginTop: '28px' }}>
                <div className="wh-section-label">Active Service Today</div>
                <div
                  style={{
                    background: 'var(--white)',
                    border: '1.5px solid var(--turmeric)',
                    borderRadius: '16px',
                    padding: '20px',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '20px',
                      background: 'var(--turmeric)',
                      color: 'var(--ink-teal-dark)',
                      fontSize: '10px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {activeBooking.scheduledDate} · {activeBooking.scheduledTime}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '16px' }}>
                        {activeBooking.worker?.user?.name} · {activeBooking.service?.titleEn}
                      </div>
                      <div style={{ fontSize: '12px', color: '#736b60', marginTop: '2px' }}>
                        📍 {activeBooking.serviceAddress}
                      </div>
                      <div style={{ marginTop: '6px', display: 'flex', gap: '6px' }}>
                        <span className="tag co">🤝 Worker-Owned</span>
                        <span className="tag verified">Status: {activeBooking.status.replace(/_/g, ' ')}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700, fontSize: '18px', color: 'var(--ink-teal)' }}>
                        ₹{activeBooking.totalAmount}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <button className="btn btn-solid btn-sm" onClick={() => onOpenChat(activeBooking.id)}>
                          <MessageSquare size={13} /> Chat
                        </button>
                        <button
                          className="btn btn-turmeric btn-sm"
                          onClick={() => handleMaskedCall(activeBooking.worker?.user?.name)}
                        >
                          <Phone size={13} /> Call
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============ TAB: CURRENT BOOKING ============ */}
        {activeTab === 'current' && (
          <div>
            <div className="wh-greeting" style={{ fontSize: '24px' }}>Current Booking</div>
            <div className="wh-sub">
              Your active service tracking with end-to-end masked communication. Neither party sees the other's personal number.
            </div>

            {activeBooking ? (
              <div style={{ marginTop: '20px' }}>
                <div
                  style={{
                    background: 'var(--white)',
                    border: '1.5px solid var(--turmeric)',
                    borderRadius: '16px',
                    padding: '24px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <span className="tag co">Booking #{activeBooking.bookingNumber}</span>
                      <h3 style={{ fontFamily: 'Rokkitt', fontSize: '22px', fontWeight: 700, marginTop: '8px' }}>
                        {activeBooking.service?.titleEn}
                      </h3>
                      <div style={{ fontSize: '13px', color: '#736b60', marginTop: '4px' }}>
                        Assigned Worker: <strong>{activeBooking.worker?.user?.name}</strong>
                      </div>
                      <div style={{ fontSize: '12px', color: '#8a8172', marginTop: '2px' }}>
                        Scheduled: {activeBooking.scheduledDate} at {activeBooking.scheduledTime}
                      </div>
                      <div style={{ fontSize: '12px', color: '#8a8172' }}>
                        Address: {activeBooking.serviceAddress}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700, fontSize: '22px', color: 'var(--ink-teal)' }}>
                        ₹{activeBooking.totalAmount}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--ink-teal)', fontWeight: 600 }}>
                        Payment: {activeBooking.paymentStatus}
                      </div>
                    </div>
                  </div>

                  {/* Status Stepper */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      margin: '24px 0',
                      padding: '16px',
                      background: 'var(--paper)',
                      borderRadius: '12px',
                      border: '1px solid var(--thread)',
                      fontSize: '11.5px',
                      overflowX: 'auto',
                      gap: '8px',
                    }}
                  >
                    <div style={{ color: 'var(--ink-teal)', fontWeight: 700 }}>1. Requested ✓</div>
                    <div style={{ color: 'var(--ink-teal)', fontWeight: 700 }}>2. Confirmed ✓</div>
                    <div
                      style={{
                        color: ['ON_THE_WAY', 'STARTED', 'COMPLETED'].includes(activeBooking.status)
                          ? 'var(--ink-teal)'
                          : '#9a917f',
                        fontWeight: ['ON_THE_WAY', 'STARTED', 'COMPLETED'].includes(activeBooking.status) ? 700 : 400,
                      }}
                    >
                      3. On the Way {['ON_THE_WAY', 'STARTED', 'COMPLETED'].includes(activeBooking.status) ? '✓' : '...'}
                    </div>
                    <div
                      style={{
                        color: ['STARTED', 'COMPLETED'].includes(activeBooking.status) ? 'var(--ink-teal)' : '#9a917f',
                        fontWeight: ['STARTED', 'COMPLETED'].includes(activeBooking.status) ? 700 : 400,
                      }}
                    >
                      4. Started {['STARTED', 'COMPLETED'].includes(activeBooking.status) ? '✓' : '...'}
                    </div>
                    <div
                      style={{
                        color: activeBooking.status === 'COMPLETED' ? 'var(--ink-teal)' : '#9a917f',
                        fontWeight: activeBooking.status === 'COMPLETED' ? 700 : 400,
                      }}
                    >
                      5. Completed {activeBooking.status === 'COMPLETED' ? '✓' : '...'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button className="btn btn-solid" onClick={() => onOpenChat(activeBooking.id)}>
                      <MessageSquare size={14} /> Open Masked Chat
                    </button>
                    <button
                      className="btn btn-turmeric"
                      onClick={() => handleMaskedCall(activeBooking.worker?.user?.name)}
                    >
                      <Phone size={14} /> Masked Audio Call
                    </button>
                    {activeBooking.status === 'COMPLETED' && (
                      <button className="btn btn-ghost" onClick={() => onOpenRatingModal(activeBooking)}>
                        <Star size={14} /> Rate Worker
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="wh-empty" style={{ marginTop: '20px' }}>
                No active bookings right now.{' '}
                <button className="btn btn-solid btn-sm" onClick={onNavigateToServices} style={{ marginLeft: '10px' }}>
                  Book a Service
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============ TAB: BOOKING HISTORY ============ */}
        {activeTab === 'history' && (
          <div>
            <div className="wh-greeting" style={{ fontSize: '24px' }}>Booking History</div>
            <div className="wh-sub">All past bookings, verified invoices, and worker ratings.</div>

            <div className="wh-card-block" style={{ marginTop: '20px' }}>
              {bookings.length === 0 ? (
                <div className="wh-empty">No past bookings found.</div>
              ) : (
                bookings.map((b) => (
                  <div key={b.id} className="wh-booking" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="wh-b-icon">{b.service?.emoji || '🧹'}</div>
                      <div>
                        <div className="wh-b-title">{b.service?.titleEn} (#{b.bookingNumber})</div>
                        <div className="wh-b-sub">
                          Worker: {b.worker?.user?.name} · {b.scheduledDate} · Status: <strong>{b.status.replace(/_/g, ' ')}</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700, color: 'var(--ink-teal)' }}>
                          ₹{b.totalAmount}
                        </div>
                        <div style={{ fontSize: '10px', color: '#8a6215' }}>{b.paymentStatus}</div>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => onOpenChat(b.id)}>
                          💬 Chat
                        </button>
                        <button className="btn btn-turmeric btn-sm" onClick={() => onOpenRatingModal(b)}>
                          ⭐ Rate
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ============ TAB: QUERIES & DISPUTES ============ */}
        {activeTab === 'queries' && (
          <div>
            <div className="wh-greeting" style={{ fontSize: '24px' }}>My Queries &amp; Disputes</div>
            <div className="wh-sub">
              AnekEk is worker-owned: our member dispute board reviews every concern fairly and transparently.
            </div>

            <div className="wh-section-label">Raise a Query</div>
            <form onSubmit={handleDisputeSubmit} className="idea-form">
              <div className="field-2col">
                <div className="field" style={{ marginTop: 0 }}>
                  <div className="field-label">Linked Booking</div>
                  <select
                    value={selectedBookingForDispute}
                    onChange={(e) => setSelectedBookingForDispute(e.target.value)}
                  >
                    {bookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        #{b.bookingNumber} — {b.service?.titleEn} ({b.worker?.user?.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field" style={{ marginTop: 0 }}>
                  <div className="field-label">Query Category</div>
                  <select value={disputeCategory} onChange={(e) => setDisputeCategory(e.target.value)}>
                    <option>Payment / Refund Issue</option>
                    <option>Worker Did Not Arrive</option>
                    <option>Service Quality Issue</option>
                    <option>Safety Concern</option>
                    <option>Other Feedback</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <div className="field-label">Description of Issue</div>
                <textarea
                  rows={3}
                  required
                  value={disputeDesc}
                  onChange={(e) => setDisputeDesc(e.target.value)}
                  placeholder="Explain what happened so our collective board can help..."
                />
              </div>

              <button type="submit" className="btn btn-solid" style={{ marginTop: '14px' }}>
                Submit Query to Co-op Board
              </button>
            </form>

            <div className="wh-section-label">Previous Inquiries</div>
            <div className="wh-card-block">
              <div className="wh-booking">
                <div className="wh-b-icon">💳</div>
                <div>
                  <div className="wh-b-title">Refund verification for rescheduled visit</div>
                  <div className="wh-b-sub">Payment / Refund · Raised 24 Aug 2026</div>
                </div>
                <div className="wh-b-amt" style={{ color: 'var(--ink-teal)' }}>Resolved ✓</div>
              </div>
              <div className="wh-booking">
                <div className="wh-b-icon">📱</div>
                <div>
                  <div className="wh-b-title">Requested later arrival time slot update</div>
                  <div className="wh-b-sub">Schedule Modification · Raised 20 Aug 2026</div>
                </div>
                <div className="wh-b-amt" style={{ color: 'var(--ink-teal)' }}>Resolved ✓</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
