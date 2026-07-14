import { useEffect, useState } from 'react';
import { api } from '../api';
import RoosterCard from '../components/RoosterCard';

export default function Roosters() {
  const [roosters, setRoosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [breedFilter, setBreedFilter] = useState('all');

  useEffect(() => {
    api
      .getRoosters()
      .then(setRoosters)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const breeds = ['all', ...new Set(roosters.map((r) => r.breed))];
  const filtered = breedFilter === 'all' ? roosters : roosters.filter((r) => r.breed === breedFilter);

  return (
    <div className="container" style={{ padding: '48px 24px 72px' }}>
      <span className="eyebrow">Catalog</span>
      <h1 style={{ fontSize: 'clamp(26px, 4.5vw, 34px)', margin: '10px 0 8px' }}>Available roosters</h1>
      <p style={{ color: 'var(--color-ink-soft)', marginBottom: 28 }}>
        Every listing below is ready for delivery. Pick one and book it in the next step.
      </p>

      {breeds.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 26, flexWrap: 'wrap' }}>
          {breeds.map((b) => (
            <button
              key={b}
              onClick={() => setBreedFilter(b)}
              className="btn"
              style={{
                padding: '8px 14px',
                fontSize: 13,
                background: breedFilter === b ? 'var(--color-ink)' : 'transparent',
                color: breedFilter === b ? 'var(--color-bg)' : 'var(--color-ink)',
                border: '1px solid var(--color-ink)',
              }}
            >
              {b === 'all' ? 'All breeds' : b}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--color-ink-soft)' }}>Loading roosters…</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: 'var(--color-ink-soft)' }}>No roosters match that filter right now.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 22 }}>
          {filtered.map((r) => (
            <RoosterCard key={r._id} rooster={r} />
          ))}
        </div>
      )}
    </div>
  );
}
