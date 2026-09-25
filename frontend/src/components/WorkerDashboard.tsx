import React, { useState, useEffect } from 'react';
import { translations, Language } from '../i18n/translations';
import { User, Booking, VoteProposal, IdeaItem } from '../types';
import { api } from '../services/api';
import { LayoutDashboard, Calendar, Star, Vote, Lightbulb, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface WorkerDashboardProps {
  user: User;
  lang: Language;
  onOpenChat: (bookingId: string) => void;
  onShowToast: (msg: string) => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({
  user,
  lang,
  onOpenChat,
  onShowToast,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'rating' | 'vote' | 'ideas'>('dashboard');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [proposals, setProposals] = useState<VoteProposal[]>([]);
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);
  const [coopFinance, setCoopFinance] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Idea Form State
  const [ideaType, setIdeaType] = useState('IDEA');
  const [ideaCategory, setIdeaCategory] = useState('Pricing & Commission');
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDesc, setIdeaDesc] = useState('');

  useEffect(() => {
    loadWorkerData();
  }, []);

  const loadWorkerData = async () => {
    setLoading(true);
    try {
      const [bRes, vRes, iRes, fRes] = await Promise.all([
        api.getBookings(),
        api.getVotes(),
        api.getIdeas(),
        api.getCoopFinance(),
      ]);
      setBookings(bRes.bookings || []);
      setProposals(vRes.proposals || []);
      setIdeas(iRes.ideas || []);
      setCoopFinance(fRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await api.updateBookingStatus(bookingId, newStatus);
      onShowToast(`Booking marked as ${newStatus.replace(/_/g, ' ')}`);
      loadWorkerData();
    } catch (err: any) {
      onShowToast(`Update error: ${err.message}`);
    }
  };

  const handleCastVote = async (proposalId: string, optionId: string) => {
    try {
      await api.castVote(proposalId, optionId);
      onShowToast('VOTE RECORDED — Thank you for exercising your co-owner voice!');
      loadWorkerData();
    } catch (err: any) {
      onShowToast(err.message);
    }
  };

  const handleIdeaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle || !ideaDesc) return;
    try {
      await api.createIdea({
        title: ideaTitle,
        category: ideaCategory,
        description: ideaDesc,
        type: ideaType,
      });
      setIdeaTitle('');
      setIdeaDesc('');
      onShowToast('SUBMITTED TO COLLECTIVE — Visible to all fellow member-owners.');
      loadWorkerData();
    } catch (err: any) {
      onShowToast(err.message);
    }
  };

  const handleSupportIdea = async (id: string) => {
    try {
      await api.supportIdea(id);
      onShowToast('SUPPORT RECORDED');
      loadWorkerData();
    } catch (err) {
      console.error(err);
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === 'REQUESTED');
  const activeBookings = bookings.filter((b) => ['ACCEPTED', 'CONFIRMED', 'ON_THE_WAY', 'STARTED'].includes(b.status));
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');

  // Calculate earnings
  const completedEarnings = completedBookings.reduce((sum, b) => sum + (b.workerEarning || 0), 0);

  return (
    <div className="wh-shell">
      <aside className="wh-sidebar">
        <div className="wh-sidebar-title">
          <span>🧑‍🔧 Worker Dashboard</span>
        </div>
        <button
          className={`wh-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={16} /> <span>{t.tabDashboard}</span>
        </button>
        <button
          className={`wh-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          <Calendar size={16} /> <span>{t.tabBookings} ({pendingBookings.length + activeBookings.length})</span>
        </button>
        <button
          className={`wh-nav-item ${activeTab === 'rating' ? 'active' : ''}`}
          onClick={() => setActiveTab('rating')}
        >
          <Star size={16} /> <span>{t.tabRating}</span>
        </button>
        <button
          className={`wh-nav-item ${activeTab === 'vote' ? 'active' : ''}`}
          onClick={() => setActiveTab('vote')}
        >
          <Vote size={16} /> <span>{t.tabVote}</span>
        </button>
        <button
          className={`wh-nav-item ${activeTab === 'ideas' ? 'active' : ''}`}
          onClick={() => setActiveTab('ideas')}
        >
          <Lightbulb size={16} /> <span>{t.tabIdeas}</span>
        </button>
      </aside>

      <div className="wh-main-area">
        {/* ============ TAB: DASHBOARD ============ */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="wh-greeting">Welcome to AnekEk, {user.name} 🎉</div>
            <div className="wh-sub">
              Your worker home as a registered co-owner. You earn transparently and vote on cooperative decisions.
            </div>

            <div className="wh-grid">
              <div className="wh-card hi">
                <div className="wh-label">This Month's Net Earnings</div>
                <div className="wh-amt">₹{completedEarnings > 0 ? completedEarnings : 585}</div>
                <div className="wh-delta">{completedBookings.length || 2} jobs completed this period</div>
              </div>
              <div className="wh-card">
                <div className="wh-label">Ownership Share</div>
                <div className="wh-amt">0.08%</div>
                <div className="wh-delta">Equal cooperative voting stake</div>
              </div>
              <div className="wh-card">
                <div className="wh-label">Cooperative Fund</div>
                <div className="wh-amt">₹{coopFinance?.fund?.totalCommission || '18,450'}</div>
                <div className="wh-delta">Emergency welfare + dividend pool</div>
              </div>
            </div>

            <div className="wh-section-label">Verification Status</div>
            <div className="wh-card-block">
              <div className="wh-booking">
                <div className="wh-b-icon">📄</div>
                <div>
                  <div className="wh-b-title">Application Submitted</div>
                  <div className="wh-b-sub">Aadhaar details &amp; contact verified</div>
                </div>
                <div className="wh-b-amt" style={{ color: 'var(--ink-teal)' }}>✓ Done</div>
              </div>
              <div className="wh-booking">
                <div className="wh-b-icon">🛡️</div>
                <div>
                  <div className="wh-b-title">Identity Verification (e-KYC)</div>
                  <div className="wh-b-sub">Masked Aadhaar KYC via Digilocker simulation</div>
                </div>
                <div className="wh-b-amt" style={{ color: 'var(--ink-teal)' }}>✓ Verified</div>
              </div>
              <div className="wh-booking">
                <div className="wh-b-icon">🤝</div>
                <div>
                  <div className="wh-b-title">Cooperative Membership Activated</div>
                  <div className="wh-b-sub">Affiliated with Maharashtra Shramik Federation / SHG</div>
                </div>
                <div className="wh-b-amt" style={{ color: 'var(--ink-teal)' }}>✓ Active Co-Owner</div>
              </div>
            </div>

            <div className="wh-section-label">How You Get Matched</div>
            <div className="wh-card-block">
              <div className="wh-info-row">
                <div className="wh-info-icon">📍</div>
                <div>
                  <div className="wh-info-title">Your Registered Service Area</div>
                  <div className="wh-info-desc">
                    Bookings are matched within your locality first to keep transit time minimal.
                  </div>
                </div>
                <div className="wh-info-val">
                  <div className="big">Powai</div>
                  <div className="small">Mumbai Metro</div>
                </div>
              </div>

              <div className="wh-info-row">
                <div className="wh-info-icon">🔄</div>
                <div>
                  <div className="wh-info-title">Fair Rotation — Not Fastest Finger</div>
                  <div className="wh-info-desc">
                    Jobs are allocated in democratic rotation queues, weighted by recency so work spreads evenly among members.
                  </div>
                </div>
                <div className="wh-info-val">
                  <div className="big">Queue #1</div>
                  <div className="small">Top Priority Today</div>
                </div>
              </div>

              <div className="wh-info-row">
                <div className="wh-info-icon">⭐</div>
                <div>
                  <div className="wh-info-title">Rating &amp; Community Feedback</div>
                  <div className="wh-info-desc">
                    Verified customer ratings factor into future allocation and community standing.
                  </div>
                </div>
                <div className="wh-info-val">
                  <div className="big">4.9 ★</div>
                  <div className="small">147 ratings</div>
                </div>
              </div>
            </div>

            <div className="wh-section-label">Transparent Pay Types</div>
            <div className="wh-pay-grid">
              <div className="wh-pay-card">
                <div className="wh-pay-icon">⏱️</div>
                <div className="wh-pay-title">Hourly-Rate Trades</div>
                <div className="wh-pay-desc">Repairs, wiring, and tutoring are calculated with hourly protection.</div>
              </div>
              <div className="wh-pay-card">
                <div className="wh-pay-icon">📅</div>
                <div className="wh-pay-title">Per-Visit Fixed Tasks</div>
                <div className="wh-pay-desc">Routine visits like cooking and cleaning are paid a clear fixed upfront rate.</div>
              </div>
            </div>
          </div>
        )}

        {/* ============ TAB: BOOKINGS ============ */}
        {activeTab === 'bookings' && (
          <div>
            <div className="wh-greeting" style={{ fontSize: '24px' }}>Your Schedule &amp; Bookings</div>
            <div className="wh-sub">Accept requests, update in-progress status, and view past job receipts.</div>

            {/* Pending Requests */}
            {pendingBookings.length > 0 && (
              <>
                <div className="wh-section-label" style={{ color: 'var(--clay)' }}>
                  Incoming Requests (Action Needed)
                </div>
                <div className="wh-card-block">
                  {pendingBookings.map((b) => (
                    <div key={b.id} className="wh-booking" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{b.service?.titleEn}</strong> · {b.customer?.user?.name}
                          <div style={{ fontSize: '11.5px', color: '#736b60' }}>
                            📍 {b.serviceAddress} · {b.scheduledDate} at {b.scheduledTime}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700, color: 'var(--ink-teal)' }}>
                            ₹{b.workerEarning} net
                          </div>
                          <div style={{ fontSize: '10px', color: '#9a917f' }}>(Gross ₹{b.totalAmount})</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <button className="btn btn-solid btn-sm" onClick={() => handleStatusUpdate(b.id, 'ACCEPTED')}>
                          ✓ Accept Job
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleStatusUpdate(b.id, 'REJECTED')}>
                          ✕ Decline
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => onOpenChat(b.id)}>
                          💬 Chat Customer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Active Bookings */}
            <div className="wh-section-label">Active / Scheduled Today</div>
            <div className="wh-card-block">
              {activeBookings.length === 0 ? (
                <div className="wh-empty">No active jobs right now. You are at the top of the rotation queue!</div>
              ) : (
                activeBookings.map((b) => (
                  <div key={b.id} className="wh-booking" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px' }}>
                          {b.service?.titleEn} (#{b.bookingNumber})
                        </div>
                        <div style={{ fontSize: '12px', color: '#736b60', marginTop: '2px' }}>
                          Customer: {b.customer?.user?.name} · 📍 {b.serviceAddress}
                        </div>
                        <div style={{ marginTop: '4px' }}>
                          <span className="tag co">Status: {b.status.replace(/_/g, ' ')}</span>
                          <span className="tag verified">Payment: {b.paymentStatus}</span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700, color: 'var(--ink-teal)', fontSize: '16px' }}>
                          ₹{b.workerEarning}
                        </div>
                        <div style={{ fontSize: '10px', color: '#9a917f' }}>Net credited on completion</div>
                      </div>
                    </div>

                    {/* Step Actions */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                      {b.status === 'ACCEPTED' || b.status === 'CONFIRMED' ? (
                        <button className="btn btn-turmeric btn-sm" onClick={() => handleStatusUpdate(b.id, 'ON_THE_WAY')}>
                          🚴 {t.markOnWay}
                        </button>
                      ) : null}

                      {b.status === 'ON_THE_WAY' && (
                        <button className="btn btn-turmeric btn-sm" onClick={() => handleStatusUpdate(b.id, 'STARTED')}>
                          🛠️ {t.markStarted}
                        </button>
                      )}

                      {b.status === 'STARTED' && (
                        <button className="btn btn-solid btn-sm" onClick={() => handleStatusUpdate(b.id, 'COMPLETED')}>
                          ✓ {t.markCompleted}
                        </button>
                      )}

                      <button className="btn btn-ghost btn-sm" onClick={() => onOpenChat(b.id)}>
                        💬 Masked Chat
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Completed Booking History */}
            <div className="wh-section-label">Completed Jobs &amp; Payouts</div>
            <div className="wh-card-block">
              {completedBookings.length === 0 ? (
                <div className="wh-empty">No completed jobs yet.</div>
              ) : (
                completedBookings.map((b) => (
                  <div key={b.id} className="wh-booking">
                    <div className="wh-b-icon">✓</div>
                    <div>
                      <div className="wh-b-title">{b.service?.titleEn} (#{b.bookingNumber})</div>
                      <div className="wh-b-sub">{b.customer?.user?.name} · {b.scheduledDate} · Completed</div>
                    </div>
                    <div className="wh-b-amt">
                      ₹{b.workerEarning}
                      <div style={{ fontSize: '10px', color: 'var(--ink-teal)', fontWeight: 400 }}>Credited</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ============ TAB: MY RATING ============ */}
        {activeTab === 'rating' && (
          <div>
            <div className="wh-greeting" style={{ fontSize: '24px' }}>My Rating &amp; Reputation</div>
            <div className="wh-sub">Direct feedback from households — builds your fair rotation allocation priority.</div>

            <div className="wh-section-label">Overview</div>
            <div className="rating-summary">
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div className="rating-big">4.9</div>
                <div className="rating-stars">★★★★★</div>
                <div className="rating-count">147 reviews</div>
              </div>
              <div className="rating-bars">
                <div className="rating-bar-row">
                  <span className="lbl">5 ★</span>
                  <div className="rating-bar-track"><div className="rating-bar-fill" style={{ width: '88%' }} /></div>
                  <span className="cnt">129</span>
                </div>
                <div className="rating-bar-row">
                  <span className="lbl">4 ★</span>
                  <div className="rating-bar-track"><div className="rating-bar-fill" style={{ width: '9%' }} /></div>
                  <span className="cnt">13</span>
                </div>
                <div className="rating-bar-row">
                  <span className="lbl">3 ★</span>
                  <div className="rating-bar-track"><div className="rating-bar-fill" style={{ width: '2%' }} /></div>
                  <span className="cnt">3</span>
                </div>
                <div className="rating-bar-row">
                  <span className="lbl">2 ★</span>
                  <div className="rating-bar-track"><div className="rating-bar-fill" style={{ width: '1%' }} /></div>
                  <span className="cnt">1</span>
                </div>
                <div className="rating-bar-row">
                  <span className="lbl">1 ★</span>
                  <div className="rating-bar-track"><div className="rating-bar-fill" style={{ width: '1%' }} /></div>
                  <span className="cnt">1</span>
                </div>
              </div>
            </div>

            <div className="wh-section-label">Verified Customer Feedback</div>
            <div className="wh-card-block">
              <div className="review-item">
                <div className="review-top">
                  <div className="review-name">Priya Sharma</div>
                  <div className="review-stars">★★★★★</div>
                </div>
                <div className="review-text">
                  "Rekha was on time and did a fantastic deep clean — will definitely book again."
                </div>
                <div className="review-meta">Home Cleaning · 27 Aug 2026 · Powai</div>
              </div>

              <div className="review-item">
                <div className="review-top">
                  <div className="review-name">Meera Joshi</div>
                  <div className="review-stars">★★★★★</div>
                </div>
                <div className="review-text">
                  "Very patient, verified credentials give huge peace of mind. Highly recommend!"
                </div>
                <div className="review-meta">Elder Care Visit · 24 Aug 2026 · Powai</div>
              </div>
            </div>
          </div>
        )}

        {/* ============ TAB: VOTE & DECISIONS ============ */}
        {activeTab === 'vote' && (
          <div>
            <div className="wh-greeting" style={{ fontSize: '24px' }}>Cooperative Democratic Decisions</div>
            <div className="wh-sub">
              Every worker-owner holds one vote. Decisions govern pricing, welfare funds, and federation rules.
            </div>

            <div style={{ marginTop: '20px' }}>
              {proposals.map((prop) => (
                <div key={prop.id} className="wh-vote-card">
                  <div className="wh-vote-top">
                    <div className="wh-vote-title">{prop.title}</div>
                    <span className="wh-vote-tag">{prop.tag}</span>
                  </div>
                  <div className="wh-vote-desc">{prop.description}</div>

                  <div className="wh-vote-options">
                    {prop.options.map((opt) => (
                      <button
                        key={opt.id}
                        className={`wh-vote-opt ${prop.userVotedOptionId === opt.id ? 'voted' : ''}`}
                        disabled={prop.hasVoted}
                        onClick={() => handleCastVote(prop.id, opt.id)}
                      >
                        <span>{opt.label}</span>
                        <span className="pct">{opt.percentage}% ({opt.voteCount})</span>
                      </button>
                    ))}
                  </div>

                  <div className="wh-vote-meta" style={{ marginTop: '10px' }}>
                    {prop.votesCastCount} of {prop.totalEligible} members voted ·{' '}
                    {prop.hasVoted ? (
                      <strong style={{ color: 'var(--ink-teal)' }}>✓ You have voted</strong>
                    ) : (
                      'Voting open for your collective'
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============ TAB: IDEAS & PROBLEMS ============ */}
        {activeTab === 'ideas' && (
          <div>
            <div className="wh-greeting" style={{ fontSize: '24px' }}>Collective Ideas &amp; Problems</div>
            <div className="wh-sub">
              Raise a safety concern or suggest a platform improvement directly to fellow member-owners.
            </div>

            <div className="wh-section-label">Share Something</div>
            <form onSubmit={handleIdeaSubmit} className="idea-form">
              <div className="field-2col">
                <div className="field" style={{ marginTop: 0 }}>
                  <div className="field-label">Type</div>
                  <select value={ideaType} onChange={(e) => setIdeaType(e.target.value)}>
                    <option value="IDEA">💡 Idea / Proposal</option>
                    <option value="PROBLEM">⚠️ Safety Concern / Problem</option>
                  </select>
                </div>
                <div className="field" style={{ marginTop: 0 }}>
                  <div className="field-label">Category</div>
                  <select value={ideaCategory} onChange={(e) => setIdeaCategory(e.target.value)}>
                    <option>Pricing &amp; Commission</option>
                    <option>Safety &amp; Workplace</option>
                    <option>App / Technology</option>
                    <option>Verification &amp; Onboarding</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <div className="field-label">Subject / Title</div>
                <input
                  type="text"
                  required
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                  placeholder="e.g. Rainy day buffer grant for outdoor workers"
                />
              </div>

              <div className="field">
                <div className="field-label">Description</div>
                <textarea
                  rows={3}
                  required
                  value={ideaDesc}
                  onChange={(e) => setIdeaDesc(e.target.value)}
                  placeholder="Describe your suggestion or issue clearly..."
                />
              </div>

              <button type="submit" className="btn btn-solid" style={{ marginTop: '14px' }}>
                Submit to Collective
              </button>
            </form>

            <div className="wh-section-label">From Your Collective</div>
            <div className="wh-card-block">
              {ideas.map((item) => (
                <div key={item.id} className="idea-feed-item">
                  <div className="idea-feed-icon">{item.type === 'IDEA' ? '💡' : '⚠️'}</div>
                  <div style={{ flex: 1 }}>
                    <div className="idea-feed-title">{item.title}</div>
                    <div className="idea-feed-sub">
                      {item.category} · Status: <strong>{item.status.replace(/_/g, ' ')}</strong> · By{' '}
                      {item.author?.name || 'Member'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#554f46', marginTop: '4px' }}>{item.description}</div>
                  </div>
                  <div className="idea-feed-support">
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '4px 10px' }}
                      onClick={() => handleSupportIdea(item.id)}
                    >
                      ▲ Support ({item.supportCount})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
