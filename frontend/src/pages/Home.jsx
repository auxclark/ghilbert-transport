import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import RoosterCard from '../components/RoosterCard';
import RoosterMark from '../components/RoosterMark';
import CombDivider from '../components/CombDivider';

export default function Home() {
  const [roosters, setRoosters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getRoosters()
      .then((data) => setRoosters(data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={{ padding: '64px 0 48px' }}>
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Rooster breeder &amp; door-to-door transport</span>
            <h1 style={{ fontSize: 'clamp(30px, 5.5vw, 48px)', lineHeight: 1.08, margin: '14px 0 18px' }}>
              Good roosters, delivered right to your yard.
            </h1>
            <p style={{ fontSize: 16.5, color: 'var(--color-ink-soft)', maxWidth: 480, marginBottom: 28 }}>
              Ghuilbert Baternatz Transport Services raises, sells, and personally delivers
              quality roosters — book online and we bring your bird home, no pickup required.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/roosters" className="btn btn-primary">Browse Roosters</Link>
              <Link to="/booking" className="btn btn-outline">Book a Delivery</Link>
            </div>
          </div>
          <div
            style={{
              background: 'var(--color-bg-raised)',
              border: '1px solid var(--color-line)',
              borderRadius: 4,
              padding: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RoosterMark size={180} />
          </div>
        </div>
      </section>

      <div className="container"><CombDivider /></div>

      {/* How it works */}
      <section style={{ padding: '56px 0' }}>
        <div className="container">
          <span className="eyebrow">How booking works</span>
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 28px)', margin: '10px 0 32px' }}>From the yard to your doorstep, in three steps</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { title: 'Choose your rooster', text: 'Pick a breed, age, and price that fits what you need.' },
              { title: 'Book a delivery', text: 'Tell us your address and preferred date — no shop visit needed.' },
              { title: 'We transport it to you', text: 'Your rooster is delivered directly, and you can track the booking anytime.' },
            ].map((step, i) => (
              <div key={step.title} className="card" style={{ padding: 22 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-comb)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 style={{ fontSize: 18, margin: '8px 0 6px' }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--color-ink-soft)' }}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container"><CombDivider color="var(--color-sage)" /></div>

      {/* Featured roosters */}
      <section style={{ padding: '56px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span className="eyebrow">Available now</span>
              <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 28px)', marginTop: 10 }}>Featured roosters</h2>
            </div>
            <Link to="/roosters" style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-comb)', textDecoration: 'none' }}>
              See all →
            </Link>
          </div>
          {loading ? (
            <p style={{ color: 'var(--color-ink-soft)' }}>Loading roosters…</p>
          ) : roosters.length === 0 ? (
            <p style={{ color: 'var(--color-ink-soft)' }}>
              No roosters are listed yet. Add some from the <Link to="/admin">admin page</Link>.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 22 }}>
              {roosters.map((r) => (
                <RoosterCard key={r._id} rooster={r} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
