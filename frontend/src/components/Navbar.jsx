import { NavLink } from 'react-router-dom';
import RoosterMark from './RoosterMark';

const linkStyle = ({ isActive }) => ({
  fontSize: 14,
  fontWeight: 600,
  color: isActive ? 'var(--color-comb)' : 'var(--color-ink)',
  textDecoration: 'none',
  paddingBottom: 4,
  borderBottom: isActive ? '2px solid var(--color-comb)' : '2px solid transparent',
});

export default function Navbar() {
  return (
    <header
      style={{
        borderBottom: '1px solid var(--color-line)',
        background: 'var(--color-bg)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div className="container navbar-inner">
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <RoosterMark size={30} />
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--color-ink)' }}>
              Ghuilbert Baternatz
            </div>
            <div className="navbar-subtitle" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: 'var(--color-ink-soft)' }}>
              TRANSPORT SERVICES
            </div>
          </div>
        </NavLink>
        <nav className="navbar-links">
          <NavLink to="/roosters" style={linkStyle}>Roosters</NavLink>
          <NavLink to="/track" style={linkStyle}>Track Order</NavLink>
          <NavLink to="/booking" className="btn btn-primary" style={{ padding: '9px 18px', fontSize: 14 }}>
            Book Now
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
