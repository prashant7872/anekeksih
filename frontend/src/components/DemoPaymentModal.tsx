import React, { useState } from 'react';
import { translations, Language } from '../i18n/translations';
import { X, CheckCircle, ShieldCheck, CreditCard, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

interface DemoPaymentModalProps {
  booking: any;
  lang: Language;
  onClose: () => void;
  onPaymentSuccess: (paymentResult: any) => void;
  onShowToast: (msg: string) => void;
}

export const DemoPaymentModal: React.FC<DemoPaymentModalProps> = ({
  booking,
  lang,
  onClose,
  onPaymentSuccess,
  onShowToast,
}) => {
  const t = translations[lang];
  const [upiId, setUpiId] = useState<string>('priyasharma@okhdfcbank');
  const [method, setMethod] = useState<string>('UPI');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<any>(null);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate realistic payment gateway latency for demo
      setTimeout(async () => {
        try {
          const res = await api.processPayment(booking.id, upiId);
          setIsProcessing(false);
          setPaymentSuccess(res.payment);
          onShowToast('Payment Successful! Worker has received confirmation.');
        } catch (err: any) {
          setIsProcessing(false);
          onShowToast(`Payment error: ${err.message}`);
        }
      }, 900);
    } catch (err: any) {
      setIsProcessing(false);
      onShowToast(`Error: ${err.message}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <button className="modal-close" onClick={paymentSuccess ? () => onPaymentSuccess(paymentSuccess) : onClose}>
          <X size={20} />
        </button>

        {!paymentSuccess ? (
          <div>
            <div className="modal-eyebrow">Demo Payment Gateway</div>
            <h2 className="modal-title">Pay for Booking #{booking.bookingNumber}</h2>

            <div
              style={{
                background: 'rgba(216, 155, 60, 0.15)',
                border: '1px dashed var(--turmeric)',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '11px',
                color: '#8a6215',
                marginTop: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ShieldCheck size={16} />
              <span>
                <strong>DEMO TRANSACTION — NO REAL MONEY TRANSFERRED</strong>
              </span>
            </div>

            <form onSubmit={handlePay} style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${method === 'UPI' ? 'btn-solid' : 'btn-ghost'}`}
                  onClick={() => setMethod('UPI')}
                  style={{ flex: 1 }}
                >
                  📱 UPI
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${method === 'CASH' ? 'btn-solid' : 'btn-ghost'}`}
                  onClick={() => setMethod('CASH')}
                  style={{ flex: 1 }}
                >
                  💵 Cash on Visit
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${method === 'WALLET' ? 'btn-solid' : 'btn-ghost'}`}
                  onClick={() => setMethod('WALLET')}
                  style={{ flex: 1 }}
                >
                  👛 Co-op Wallet
                </button>
              </div>

              {method === 'UPI' ? (
                <div className="field" style={{ marginTop: 0 }}>
                  <div className="field-label">Virtual Payment Address (VPA / UPI ID)</div>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@okhdfcbank"
                  />
                  <div style={{ fontSize: '11px', color: '#9a917f', marginTop: '4px' }}>
                    Supported: Google Pay, PhonePe, BHIM, Paytm
                  </div>
                </div>
              ) : (
                <div style={{ padding: '16px', background: 'var(--paper)', borderRadius: '10px', fontSize: '12.5px', color: '#635b50' }}>
                  {method === 'CASH'
                    ? 'Payment of ₹' + booking.totalAmount + ' will be collected directly by the worker upon job completion. The 10% co-op commission will settle automatically.'
                    : 'AnekEk member credit balance will be debited upon completion.'}
                </div>
              )}

              <div
                style={{
                  background: 'var(--paper)',
                  borderRadius: '12px',
                  padding: '14px',
                  marginTop: '18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', color: '#736b60' }}>Amount Payable</div>
                  <div style={{ fontSize: '20px', fontFamily: 'Rokkitt', fontWeight: 700, color: 'var(--ink-teal)' }}>
                    ₹{booking.totalAmount}
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#8a6215', textAlign: 'right' }}>
                  ₹{booking.workerEarning} direct to worker-owner
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-solid"
                disabled={isProcessing}
                style={{ width: '100%', marginTop: '20px', padding: '13px', fontSize: '14px' }}
              >
                {isProcessing ? 'Processing UPI Verification...' : `Pay ₹${booking.totalAmount} via DEMO UPI`}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <CheckCircle size={56} color="var(--ink-teal)" style={{ margin: '0 auto 12px auto' }} />
            <h2 className="modal-title" style={{ color: 'var(--ink-teal)' }}>Payment Successful!</h2>
            <div style={{ fontSize: '12px', color: '#8a6215', fontWeight: 600, marginTop: '4px' }}>
              DEMO TRANSACTION — NO REAL MONEY TRANSFERRED
            </div>

            <div
              style={{
                background: 'var(--paper)',
                borderRadius: '14px',
                padding: '18px',
                margin: '20px 0',
                textAlign: 'left',
                border: '1px solid var(--thread)',
                fontSize: '12.5px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#736b60' }}>Transaction Reference:</span>
                <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700 }}>{paymentSuccess.transactionRef}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#736b60' }}>Booking Number:</span>
                <span style={{ fontFamily: 'IBM Plex Mono' }}>{booking.bookingNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#736b60' }}>Amount:</span>
                <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700, color: 'var(--ink-teal)' }}>
                  ₹{paymentSuccess.amount}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#736b60' }}>Status:</span>
                <span style={{ color: 'var(--ink-teal)', fontWeight: 700 }}>COMPLETED (DEMO)</span>
              </div>
            </div>

            <button
              className="btn btn-solid"
              style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onClick={() => onPaymentSuccess(paymentSuccess)}
            >
              <span>Go to Customer Dashboard</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
