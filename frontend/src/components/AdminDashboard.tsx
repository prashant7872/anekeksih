import React, { useState, useEffect } from 'react';
import { translations, Language } from '../i18n/translations';
import { api } from '../services/api';
import { ShieldCheck, Users, Briefcase, DollarSign, AlertCircle, CheckCircle, BarChart3 } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AdminDashboardProps {
  lang: Language;
  onShowToast: (msg: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang, onShowToast }) => {
  const t = translations[lang];
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminAnalytics();
      setAnalytics(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveVerification = async (id: string) => {
    try {
      await api.updateVerification(id, 'VERIFIED', 'Approved by federation board review.');
      onShowToast('Worker Verification Approved!');
      loadAnalytics();
    } catch (err: any) {
      onShowToast(err.message);
    }
  };

  const handleResolveDispute = async (id: string) => {
    try {
      await api.updateDispute(id, 'RESOLVED', 'Mutual agreement reached via collective mediation.');
      onShowToast('Dispute Resolved!');
      loadAnalytics();
    } catch (err: any) {
      onShowToast(err.message);
    }
  };

  if (loading || !analytics) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#9a917f' }}>
        Loading Federation Analytics &amp; Decision Records...
      </div>
    );
  }

  const { metrics, serviceDemand, bookingTrends, localityDemand, pendingVerifsList, disputesList } = analytics;

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '36px 24px 80px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div className="modal-eyebrow">Federation Governance &amp; Oversight</div>
          <h1 className="wh-greeting" style={{ fontSize: '32px' }}>AnekEk Federation Admin</h1>
          <div className="wh-sub">Real-time cooperative ledger, demand forecasting, and verification audit.</div>
        </div>

        <span className="demo-badge" style={{ fontSize: '11px', padding: '6px 12px' }}>
          Smart India Hackathon 2026 · DEMO BOARD
        </span>
      </div>

      {/* KPI Cards Strip */}
      <div className="wh-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginTop: '26px' }}>
        <div className="wh-card">
          <div className="wh-label">Total Worker-Owners</div>
          <div className="wh-amt">{metrics.totalWorkers}</div>
          <div className="wh-delta" style={{ color: 'var(--ink-teal)' }}>
            ✓ {metrics.verifiedWorkers} KYC Verified
          </div>
        </div>

        <div className="wh-card">
          <div className="wh-label">Total Households Served</div>
          <div className="wh-amt">{metrics.totalCustomers}</div>
          <div className="wh-delta">{metrics.bookingsTotal} total bookings</div>
        </div>

        <div className="wh-card hi">
          <div className="wh-label">Gross Platform Volume</div>
          <div className="wh-amt">₹{metrics.totalRevenue.toLocaleString()}</div>
          <div className="wh-delta">₹{metrics.workerEarnings.toLocaleString()} direct to workers (90%)</div>
        </div>

        <div className="wh-card">
          <div className="wh-label">Cooperative Fund Pools</div>
          <div className="wh-amt" style={{ color: '#8a6215' }}>
            ₹{metrics.cooperativeFund.toLocaleString()}
          </div>
          <div className="wh-delta">Welfare, Insurance, Dividends</div>
        </div>
      </div>

      {/* Charts Row: Weekly Demand Trends & Service Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', marginTop: '30px' }}>
        {/* Weekly Trend Area Chart */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--thread)', borderRadius: '16px', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>Weekly Booking Volume &amp; Earnings</div>
              <div style={{ fontSize: '11.5px', color: '#736b60' }}>Demand forecasting across days</div>
            </div>
            <span className="demo-badge">Live Trends</span>
          </div>

          <div style={{ height: '230px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--paper-dark)" />
                <XAxis dataKey="day" stroke="#8a8172" fontSize={11} />
                <YAxis stroke="#8a8172" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: 'var(--white)', borderRadius: '8px', border: '1px solid var(--thread)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#D89B3C" fill="#EFC988" fillOpacity={0.4} name="Total Volume (₹)" />
                <Area type="monotone" dataKey="workerEarnings" stroke="#1C4B44" fill="#1C4B44" fillOpacity={0.2} name="Worker Share (₹)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Demand Bar Chart */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--thread)', borderRadius: '16px', padding: '22px' }}>
          <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>Demand by Service Cluster</div>
          <div style={{ fontSize: '11.5px', color: '#736b60', marginBottom: '14px' }}>Trades &amp; Care requests</div>

          <div style={{ height: '230px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceDemand.slice(0, 6)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--paper-dark)" />
                <XAxis type="number" stroke="#8a8172" fontSize={10} />
                <YAxis type="category" dataKey="name" stroke="#8a8172" fontSize={10} width={75} />
                <Tooltip
                  contentStyle={{ background: 'var(--white)', borderRadius: '8px', border: '1px solid var(--thread)' }}
                />
                <Bar dataKey="bookingsCount" fill="#1C4B44" radius={[0, 4, 4, 0]} name="Completed Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two Tables: Pending Verifications & Open Disputes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
        {/* Pending Verifications */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--thread)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>Worker Verification Queue</div>
            <span className="tag warning">{metrics.pendingVerifications} Pending</span>
          </div>

          {pendingVerifsList.length === 0 ? (
            <div style={{ fontSize: '12px', color: '#8a8172', padding: '20px 0', textAlign: 'center' }}>
              All worker applicants currently verified!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pendingVerifsList.map((v: any) => (
                <div
                  key={v.id}
                  style={{
                    padding: '10px',
                    border: '1px solid var(--paper-dark)',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{v.worker?.user?.name}</div>
                    <div style={{ fontSize: '11px', color: '#736b60' }}>
                      {v.verificationType.replace(/_/g, ' ')} · {v.documentMasked || 'Doc submitted'}
                    </div>
                  </div>
                  <button
                    className="btn btn-solid btn-sm"
                    onClick={() => handleApproveVerification(v.id)}
                  >
                    ✓ Approve e-KYC
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Disputes & Quality Management */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--thread)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>Dispute Mediation Board</div>
            <span className="tag co">{metrics.openDisputes} Open</span>
          </div>

          {disputesList.length === 0 ? (
            <div style={{ fontSize: '12px', color: '#8a8172', padding: '20px 0', textAlign: 'center' }}>
              No active customer disputes!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {disputesList.map((d: any) => (
                <div
                  key={d.id}
                  style={{
                    padding: '10px',
                    border: '1px solid var(--paper-dark)',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{d.category}</div>
                    <div style={{ fontSize: '11px', color: '#736b60' }}>
                      By {d.customer?.user?.name} · {d.description.slice(0, 45)}...
                    </div>
                  </div>
                  <button
                    className="btn btn-turmeric btn-sm"
                    onClick={() => handleResolveDispute(d.id)}
                  >
                    ✓ Resolve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
