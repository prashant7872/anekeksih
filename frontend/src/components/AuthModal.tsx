import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck } from 'lucide-react';
import { api, setAuthToken } from '../services/api';
import { User } from '../types';

interface AuthModalProps {
  initialMode: 'login' | 'worker-signup' | 'provider-signup';
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onShowToast: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode,
  onClose,
  onLoginSuccess,
  onShowToast,
}) => {
  const [mode, setMode] = useState<'login' | 'worker-signup' | 'provider-signup'>(initialMode);

  // Login form state
  const [loginPhone, setLoginPhone] = useState('9876543210');
  const [loginOtp, setLoginOtp] = useState(['1', '2', '3', '4']);
  const [otpSent, setOtpSent] = useState(false);

  // Worker signup state
  const [workerName, setWorkerName] = useState('Rekha Sharma');
  const [workerPhone, setWorkerPhone] = useState('9876543210');
  const [workerAadhaar, setWorkerAadhaar] = useState('482188994821');
  const [workerLocality, setWorkerLocality] = useState('Powai, Mumbai');
  const [workerService, setWorkerService] = useState('cleaning');
  const [workerShg, setWorkerShg] = useState('Andheri Domestic Workers Collective');
  const [workerExp, setWorkerExp] = useState('6');
  const [hasCert, setHasCert] = useState(false);

  // Provider signup state
  const [provName, setProvName] = useState('Priya Sharma');
  const [provPhone, setProvPhone] = useState('9123456789');
  const [provLocality, setProvLocality] = useState('Powai, Mumbai');

  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!loginPhone || loginPhone.length < 10) {
      onShowToast('Please enter a valid 10-digit phone number');
      return;
    }
    setOtpSent(true);
    onShowToast(`Demo OTP 1234 sent to +91 ${loginPhone}`);
  };

  const handleVerifyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const otpVal = loginOtp.join('');

    try {
      const res = await api.verifyOtp(loginPhone, otpVal);
      setAuthToken(res.token);
      onShowToast(`Logged in successfully! Welcome, ${res.user.name}`);
      onLoginSuccess(res.user);
      onClose();
    } catch (err: any) {
      onShowToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.registerWorker({
        name: workerName,
        phone: workerPhone,
        aadhaarNumber: workerAadhaar,
        locality: workerLocality,
        serviceName: workerService,
        experienceYears: workerExp,
        shgName: workerShg,
        hasBackgroundCert: hasCert,
      });

      setAuthToken(res.token);
      onShowToast('Worker Registered! Welcome to the AnekEk cooperative.');
      onLoginSuccess(res.user);
      onClose();
    } catch (err: any) {
      onShowToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.verifyOtp(provPhone, '1234', 'CUSTOMER', provName);
      setAuthToken(res.token);
      onShowToast(`Welcome, ${res.user.name}! Your household account is ready.`);
      onLoginSuccess(res.user);
      onClose();
    } catch (err: any) {
      onShowToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: string) => {
    setLoading(true);
    try {
      const res = await api.demoLogin(role);
      setAuthToken(res.token);
      onShowToast(`Switched to Demo ${role}!`);
      onLoginSuccess(res.user);
      onClose();
    } catch (err: any) {
      onShowToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal-card ${mode === 'worker-signup' ? 'wide' : ''}`}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--paper-dark)', paddingBottom: '10px' }}>
          <button
            className={`btn btn-sm ${mode === 'login' ? 'btn-solid' : 'btn-ghost'}`}
            onClick={() => setMode('login')}
          >
            Log In
          </button>
          <button
            className={`btn btn-sm ${mode === 'worker-signup' ? 'btn-solid' : 'btn-ghost'}`}
            onClick={() => setMode('worker-signup')}
          >
            Join as Worker
          </button>
          <button
            className={`btn btn-sm ${mode === 'provider-signup' ? 'btn-solid' : 'btn-ghost'}`}
            onClick={() => setMode('provider-signup')}
          >
            Sign Up as Household
          </button>
        </div>

        {/* ============ MODE: LOGIN ============ */}
        {mode === 'login' && (
          <div>
            <div className="modal-eyebrow">Welcome Back</div>
            <h2 className="modal-title">Log In to AnekEk</h2>
            <div style={{ fontSize: '13px', color: '#736b60', marginTop: '4px' }}>
              Enter your mobile number. We use a simulated OTP for the SIH 2026 presentation.
            </div>

            <form onSubmit={otpSent ? handleVerifyLogin : (e) => { e.preventDefault(); handleSendOtp(); }}>
              <div className="field">
                <div className="field-label">Mobile Number <span className="req">*</span></div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ padding: '11px 14px', background: 'var(--paper-dark)', border: '1.5px solid var(--thread)', borderRadius: '10px', fontWeight: 600 }}>
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="98765 43210"
                  />
                </div>
              </div>

              {otpSent && (
                <div className="field">
                  <div className="field-label">Enter OTP <span className="req">*</span></div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {[0, 1, 2, 3].map((idx) => (
                      <input
                        key={idx}
                        className="otp-box"
                        type="text"
                        maxLength={1}
                        value={loginOtp[idx]}
                        onChange={(e) => {
                          const next = [...loginOtp];
                          next[idx] = e.target.value;
                          setLoginOtp(next);
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: '11px', color: '#8a6215', marginTop: '6px' }}>
                    💡 <em>DEMO OTP: Enter <strong>1234</strong> to authenticate.</em>
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-solid" style={{ width: '100%', marginTop: '20px', padding: '12px' }} disabled={loading}>
                {otpSent ? 'Verify & Continue' : 'Send Demo OTP'}
              </button>
            </form>

            {/* Quick Demo Logins */}
            <div style={{ marginTop: '24px', borderTop: '1px dashed var(--thread)', paddingTop: '16px' }}>
              <div style={{ fontSize: '11px', fontFamily: 'IBM Plex Mono', color: '#9a917f', marginBottom: '8px' }}>
                OR ONE-CLICK DEMO LOGIN AS:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => handleQuickDemo('WORKER')}>
                  🧑‍🔧 Worker (Rekha)
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => handleQuickDemo('CUSTOMER')}>
                  🏠 Customer (Priya)
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => handleQuickDemo('PLATFORM_ADMIN')}>
                  🛡️ Federation Admin
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============ MODE: WORKER SIGNUP ============ */}
        {mode === 'worker-signup' && (
          <div>
            <div className="modal-eyebrow">Worker Onboarding</div>
            <h2 className="modal-title">Register as a Co-Owner Worker</h2>
            <div style={{ fontSize: '13px', color: '#736b60', marginTop: '4px' }}>
              Join your local collective with verified identity and fair commission rights.
            </div>

            <form onSubmit={handleWorkerRegister}>
              <div className="field-2col">
                <div className="field">
                  <div className="field-label">Full Name <span className="req">*</span></div>
                  <input
                    type="text"
                    required
                    value={workerName}
                    onChange={(e) => setWorkerName(e.target.value)}
                    placeholder="As per Aadhaar card"
                  />
                </div>
                <div className="field">
                  <div className="field-label">Mobile Number <span className="req">*</span></div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={workerPhone}
                    onChange={(e) => setWorkerPhone(e.target.value)}
                    placeholder="98765 43210"
                  />
                </div>
              </div>

              <div className="field-2col">
                <div className="field">
                  <div className="field-label">Aadhaar (e-KYC Simulated) <span className="req">*</span></div>
                  <input
                    type="text"
                    required
                    maxLength={12}
                    value={workerAadhaar}
                    onChange={(e) => setWorkerAadhaar(e.target.value)}
                    placeholder="12 digits"
                  />
                  <div style={{ fontSize: '10px', color: '#9a917f', marginTop: '2px' }}>
                    Masked as XXXX-XXXX-4821 (Never stored in raw text).
                  </div>
                </div>

                <div className="field">
                  <div className="field-label">Service Area / Locality <span className="req">*</span></div>
                  <input
                    type="text"
                    required
                    value={workerLocality}
                    onChange={(e) => setWorkerLocality(e.target.value)}
                    placeholder="e.g. Powai, Mumbai"
                  />
                </div>
              </div>

              <div className="field-2col">
                <div className="field">
                  <div className="field-label">Primary Trade Skill <span className="req">*</span></div>
                  <select value={workerService} onChange={(e) => setWorkerService(e.target.value)}>
                    <option value="cleaning">Home Cleaning &amp; Sanitization</option>
                    <option value="plumbing">Plumbing &amp; Pipe Repair</option>
                    <option value="electrical">Electrical Repair &amp; Wiring</option>
                    <option value="carpentry">Carpentry &amp; Woodwork</option>
                    <option value="cooking">Cooking &amp; Meal Prep</option>
                    <option value="eldercare">Elder Care (Requires Cert)</option>
                    <option value="childcare">Childcare (Requires Cert)</option>
                    <option value="appliance">Appliance Repair</option>
                    <option value="gardening">Gardening &amp; Landscaping</option>
                  </select>
                </div>

                <div className="field">
                  <div className="field-label">Linked SHG / Labour Collective</div>
                  <select value={workerShg} onChange={(e) => setWorkerShg(e.target.value)}>
                    <option>Andheri Domestic Workers Collective</option>
                    <option>SEWA Mumbai Union</option>
                    <option>Maharashtra Bijli Shramik Sangh</option>
                    <option>DAY-NULM Registered Self-Help Group</option>
                    <option>Direct Cooperative Applicant</option>
                  </select>
                </div>
              </div>

              {(workerService === 'eldercare' || workerService === 'childcare') && (
                <div
                  style={{
                    background: 'rgba(168, 80, 58, 0.08)',
                    border: '1px solid var(--clay)',
                    borderRadius: '10px',
                    padding: '12px',
                    marginTop: '14px',
                    fontSize: '12px',
                    color: '#8a3a28',
                  }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={hasCert}
                      onChange={(e) => setHasCert(e.target.checked)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span>
                      <strong>Police Character / Background Verification Certificate Attached</strong>
                    </span>
                  </label>
                  <div style={{ marginTop: '4px', fontSize: '11px', opacity: 0.85 }}>
                    Mandatory for vulnerable care roles to ensure household trust.
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-solid" style={{ width: '100%', marginTop: '20px', padding: '13px' }} disabled={loading}>
                {loading ? 'Submitting Registration...' : 'Submit Co-Ownership Registration'}
              </button>
            </form>
          </div>
        )}

        {/* ============ MODE: PROVIDER SIGNUP ============ */}
        {mode === 'provider-signup' && (
          <div>
            <div className="modal-eyebrow">Household Sign Up</div>
            <h2 className="modal-title">Book Trusted Co-Owner Services</h2>
            <div style={{ fontSize: '13px', color: '#736b60', marginTop: '4px' }}>
              Connect with verified local workers while keeping your personal phone number strictly private.
            </div>

            <form onSubmit={handleProviderRegister}>
              <div className="field">
                <div className="field-label">Full Name <span className="req">*</span></div>
                <input
                  type="text"
                  required
                  value={provName}
                  onChange={(e) => setProvName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                />
              </div>

              <div className="field">
                <div className="field-label">Mobile Number <span className="req">*</span></div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={provPhone}
                  onChange={(e) => setProvPhone(e.target.value)}
                  placeholder="98765 43210"
                />
              </div>

              <div className="field">
                <div className="field-label">Locality / Area <span className="req">*</span></div>
                <input
                  type="text"
                  required
                  value={provLocality}
                  onChange={(e) => setProvLocality(e.target.value)}
                  placeholder="e.g. Powai, Mumbai"
                />
              </div>

              <button
                type="submit"
                className="btn btn-solid"
                style={{ width: '100%', marginTop: '20px', padding: '12px' }}
                disabled={loading}
              >
                {loading ? 'Registering Household...' : 'Complete Household Registration'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
