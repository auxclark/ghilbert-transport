import { useLocation, useParams, Link } from 'react-router-dom';
import RoosterMark from '../components/RoosterMark';

export default function Confirmation() {
  const { id } = useParams();
  const location = useLocation();
  const booking = location.state?.booking;

  return (
    <div className="container" style={{ padding: '64px 24px', maxWidth: 560, textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <RoosterMark size={64} color="var(--color-sage)" />
      </div>
      <h1 style={{ fontSize: 'clamp(24px, 4.5vw, 30px)', marginBottom: 10 }}>Booking confirmed</h1>
      <p style={{ color: 'var(--color-ink-soft)', marginBottom: 28 }}>
        Thank you{booking ? `, ${booking.customerName}` : ''}. We've received your booking and will reach out to
        confirm delivery details.
      </p>

      <div className="card" style={{ padding: 24, textAlign: 'left', marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-ink-soft)', marginBottom: 10 }}>
          BOOKING REFERENCE
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, marginBottom: 16, wordBreak: 'break-all' }}>
          {id}
        </div>
        {booking && (
          <>
            <Row label="Rooster" value={booking.roosterNameAtBooking} />
            <Row label="Quantity" value={booking.quantity} />
            <Row label="Delivery address" value={booking.deliveryAddress} />
            <Row label="Preferred date" value={new Date(booking.preferredDate).toLocaleDateString()} />
            <Row label="Status" value={booking.status} last />
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Link to="/track" className="btn btn-outline">Track this booking</Link>
        <Link to="/roosters" className="btn btn-primary">Browse more roosters</Link>
      </div>
    </div>
  );
}

function Row({ label, value, last }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: last ? 'none' : '1px solid var(--color-line)',
        fontSize: 14,
      }}
    >
      <span style={{ color: 'var(--color-ink-soft)' }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}
