import { Link } from 'react-router-dom';
import RoosterMark from './RoosterMark';
import { assetUrl } from '../api';

export default function RoosterCard({ rooster }) {
  return (
    <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          height: 150,
          background: 'linear-gradient(135deg, #f0e9d6, #e7dfc8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {rooster.imageUrl ? (
          <img src={assetUrl(rooster.imageUrl)} alt={rooster.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <RoosterMark size={56} color="var(--color-comb)" />
        )}
      </div>
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h3 style={{ fontSize: 19 }}>{rooster.name}</h3>
          <span className="tag">{rooster.breed}</span>
        </div>
        <p style={{ fontSize: 13.5, color: 'var(--color-ink-soft)' }}>{rooster.ageMonths} months old</p>
        <p style={{ fontSize: 14, color: 'var(--color-ink-soft)', flex: 1 }}>
          {rooster.description || 'A well-conditioned rooster ready for its new yard.'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--color-comb)' }}>
            ₱{rooster.price.toLocaleString()}
          </span>
          <Link to={`/roosters/${rooster._id}`} className="btn btn-outline" style={{ fontSize: 13, padding: '9px 14px' }}>
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
