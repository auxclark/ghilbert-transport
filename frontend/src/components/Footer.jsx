import CombDivider from './CombDivider';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-ink)', color: 'var(--color-bg)', marginTop: 80 }}>
      <CombDivider color="var(--color-gold)" flip />
      <div className="container" style={{ padding: '40px 24px 32px', display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
            Ghuilbert Baternatz
          </div>
          <p style={{ fontSize: 13.5, color: '#d8d0c0', maxWidth: 260 }}>
            Raising and delivering quality roosters, straight from the yard to your doorstep.
          </p>
        </div>
        <div>
          <div className="eyebrow" style={{ color: 'var(--color-gold)', marginBottom: 10 }}>Contact</div>
          <p style={{ fontSize: 13.5, color: '#d8d0c0' }}>0917 000 0000</p>
          <p style={{ fontSize: 13.5, color: '#d8d0c0' }}>hello@ghuilbertbaternatz.ph</p>
        </div>
        <div>
          <div className="eyebrow" style={{ color: 'var(--color-gold)', marginBottom: 10 }}>Delivery Area</div>
          <p style={{ fontSize: 13.5, color: '#d8d0c0' }}>Calabarzon and nearby provinces, door-to-door transport included.</p>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #443c33', padding: '14px 24px', textAlign: 'center', fontSize: 12, color: '#a89c86', fontFamily: 'var(--font-mono)' }}>
        © {new Date().getFullYear()} Ghuilbert Baternatz Transport Services
      </div>
    </footer>
  );
}
