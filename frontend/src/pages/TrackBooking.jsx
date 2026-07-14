import { useState } from 'react';
import { api } from '../api';

export default function TrackBooking() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(ev) {
    ev.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.lookupBookings(email);
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ padding: '48px 24px 80px', maxWidth: 640 }}>
      <span className="eyebrow">Track order</span>
      <h1 style={{ fontSize: 'clamp(26px, 4.5vw, 32px)', margin: '10px 0 8px' }}>Find your booking</h1>
      <p style={{ color: 'var(--color-ink-soft)', marginBottom: 28 }}>
        Enter the email address you used when booking to see its status.
      </p>

      <form onSubmit={handleSubmit} className="track-form">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ flex: 1, border: '1px solid var(--color-line)', borderRadius: 3, padding: '11px 13px' }}
        />
        <button className="btn btn-primary" disabled={loading}>{loading ? 'Searching…' : 'Search'}</button>
      </form>

      {error && <p className="alert alert-error">{error}</p>}

      {bookings && bookings.length === 0 && (
        <p style={{ color: 'var(--color-ink-soft)' }}>No bookings found for that email.</p>
      )}

      {bookings && bookings.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {bookings.map((b) => (
            <div key={b._id} className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong>{b.roosterNameAtBooking}</strong>
                <span className={`tag tag-status-${b.status}`}>{b.status.replace(/_/g, ' ')}</span>
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--color-ink-soft)' }}>
                Qty {b.quantity} · Preferred date: {new Date(b.preferredDate).toLocaleDateString()}
              </p>
              <p style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--color-ink-soft)', marginTop: 6 }}>
                Ref: {b._id}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
