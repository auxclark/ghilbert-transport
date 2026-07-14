import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, assetUrl } from '../api';
import RoosterMark from '../components/RoosterMark';

export default function RoosterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rooster, setRooster] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getRooster(id)
      .then(setRooster)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div className="container" style={{ padding: '48px 24px' }}>
        <p className="alert alert-error">{error}</p>
        <Link to="/roosters">← Back to catalog</Link>
      </div>
    );
  }

  if (!rooster) {
    return <div className="container" style={{ padding: '48px 24px' }}>Loading…</div>;
  }

  return (
    <div className="container detail-grid" style={{ padding: '48px 24px 72px' }}>
      <div
        className="card"
        style={{ height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0e9d6, #e7dfc8)' }}
      >
        {rooster.imageUrl ? (
          <img src={assetUrl(rooster.imageUrl)} alt={rooster.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <RoosterMark size={120} />
        )}
      </div>
      <div>
        <span className="tag">{rooster.breed}</span>
        <h1 style={{ fontSize: 'clamp(26px, 4.5vw, 34px)', margin: '12px 0 6px' }}>{rooster.name}</h1>
        <p style={{ color: 'var(--color-ink-soft)', marginBottom: 18 }}>{rooster.ageMonths} months old · {rooster.stock} in stock</p>
        <p style={{ fontSize: 15.5, color: 'var(--color-ink-soft)', marginBottom: 24 }}>
          {rooster.description || 'A well-conditioned rooster ready for its new yard.'}
        </p>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 30, color: 'var(--color-comb)', marginBottom: 26 }}>
          ₱{rooster.price.toLocaleString()}
        </div>
        <button
          className="btn btn-primary"
          disabled={!rooster.available || rooster.stock < 1}
          onClick={() => navigate(`/booking?roosterId=${rooster._id}`)}
        >
          {rooster.available ? 'Book This Rooster' : 'Currently Unavailable'}
        </button>
      </div>
    </div>
  );
}
