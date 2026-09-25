import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { Booking } from '../types';
import { api } from '../services/api';

interface RatingModalProps {
  booking: Booking;
  onClose: () => void;
  onRatingSuccess: () => void;
  onShowToast: (msg: string) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  booking,
  onClose,
  onRatingSuccess,
  onShowToast,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('Punctual, thorough, and highly professional service!');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.submitRating(booking.id, rating, comment);
      onShowToast('Rating submitted! Thank you for supporting worker ownership.');
      onRatingSuccess();
      onClose();
    } catch (err: any) {
      onShowToast(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-eyebrow">Two-Way Cooperative Feedback</div>
        <h2 className="modal-title">Rate {booking.worker?.user?.name}</h2>
        <div style={{ fontSize: '13px', color: '#736b60', marginTop: '3px' }}>
          {booking.service?.titleEn} (#{booking.bookingNumber})
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          {/* Star selector */}
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transform: (hoverRating || rating) >= star ? 'scale(1.15)' : 'scale(1)',
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={36}
                    fill={(hoverRating || rating) >= star ? 'var(--turmeric)' : 'none'}
                    color={(hoverRating || rating) >= star ? 'var(--turmeric)' : 'var(--thread)'}
                  />
                </button>
              ))}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-teal)', marginTop: '8px' }}>
              {rating === 5 ? '5 Stars — Exceptional' : `${rating} Stars`}
            </div>
          </div>

          <div className="field">
            <div className="field-label">Your Review &amp; Comments</div>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other households about the quality of service..."
            />
          </div>

          <button
            type="submit"
            className="btn btn-solid"
            disabled={submitting}
            style={{ width: '100%', marginTop: '20px', padding: '12px' }}
          >
            {submitting ? 'Submitting...' : 'Submit Cooperative Review'}
          </button>
        </form>
      </div>
    </div>
  );
};
