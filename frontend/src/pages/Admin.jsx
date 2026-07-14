import { useEffect, useState } from 'react';
import { api, assetUrl } from '../api';

const STATUS_OPTIONS = ['pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled'];

const emptyRooster = { name: '', breed: '', ageMonths: '', price: '', cost: '', description: '', imageUrl: '', stock: 1 };

const money = (n) => `₱${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function Admin() {
  const [passcode, setPasscode] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState('dashboard');

  const [bookings, setBookings] = useState([]);
  const [roosters, setRoosters] = useState([]);
  const [summary, setSummary] = useState(null);
  const [expandedClient, setExpandedClient] = useState(null);
  const [newRooster, setNewRooster] = useState(emptyRooster);
  const [error, setError] = useState('');
  const [uploadingNew, setUploadingNew] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);

  async function handleLogin(ev) {
    ev.preventDefault();
    setLoginError('');
    try {
      await api.adminLogin(passcode);
      setAuthed(true);
    } catch (err) {
      setLoginError(err.message);
    }
  }

  async function loadData() {
    try {
      const [b, r, s] = await Promise.all([
        api.getAllBookings(passcode),
        api.getRoosters(true),
        api.getSummary(passcode),
      ]);
      setBookings(b);
      setRoosters(r);
      setSummary(s);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (authed) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  async function handleStatusChange(id, status) {
    try {
      await api.updateBookingStatus(passcode, id, status);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAddRooster(ev) {
    ev.preventDefault();
    setError('');
    try {
      await api.createRooster(passcode, {
        ...newRooster,
        ageMonths: Number(newRooster.ageMonths),
        price: Number(newRooster.price),
        cost: Number(newRooster.cost || 0),
        stock: Number(newRooster.stock),
      });
      setNewRooster(emptyRooster);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleNewRoosterPhoto(ev) {
    const file = ev.target.files?.[0];
    ev.target.value = '';
    if (!file) return;
    setError('');
    setUploadingNew(true);
    try {
      const { url } = await api.uploadImage(passcode, file);
      setNewRooster((prev) => ({ ...prev, imageUrl: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingNew(false);
    }
  }

  async function handleExistingRoosterPhoto(rooster, ev) {
    const file = ev.target.files?.[0];
    ev.target.value = '';
    if (!file) return;
    setError('');
    setUploadingId(rooster._id);
    try {
      const { url } = await api.uploadImage(passcode, file);
      await api.updateRooster(passcode, rooster._id, { imageUrl: url });
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingId(null);
    }
  }

  async function handleToggleAvailable(rooster) {
    try {
      await api.updateRooster(passcode, rooster._id, { available: !rooster.available });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteRooster(id) {
    if (!confirm('Remove this rooster listing?')) return;
    try {
      await api.deleteRooster(passcode, id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  if (!authed) {
    return (
      <div className="container" style={{ padding: '72px 24px', maxWidth: 400 }}>
        <span className="eyebrow">Admin</span>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 28px)', margin: '10px 0 20px' }}>Enter passcode</h1>
        {loginError && <p className="alert alert-error">{loginError}</p>}
        <form onSubmit={handleLogin} className="card" style={{ padding: 22 }}>
          <div className="field">
            <label htmlFor="passcode">Admin passcode</label>
            <input
              id="passcode"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }}>Unlock</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '48px 24px 80px' }}>
      <span className="eyebrow">Admin</span>
      <h1 style={{ fontSize: 'clamp(24px, 4vw, 30px)', margin: '10px 0 20px' }}>Manage the shop</h1>

      {error && <p className="alert alert-error">{error}</p>}

      <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
        {[
          ['dashboard', 'Dashboard'],
          ['bookings', 'Bookings'],
          ['clients', 'Clients'],
          ['inventory', 'Inventory'],
        ].map(([key, label]) => (
          <button
            key={key}
            className="btn"
            style={{ background: tab === key ? 'var(--color-ink)' : 'transparent', color: tab === key ? 'var(--color-bg)' : 'var(--color-ink)', border: '1px solid var(--color-ink)' }}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && summary && (
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 14,
              marginBottom: 28,
            }}
          >
            <div className="card" style={{ padding: 18 }}>
              <p style={{ fontSize: 12, color: 'var(--color-ink-soft)', marginBottom: 6 }}>Total orders</p>
              <p style={{ fontSize: 26, fontWeight: 700 }}>{summary.totalOrders}</p>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <p style={{ fontSize: 12, color: 'var(--color-ink-soft)', marginBottom: 6 }}>Revenue</p>
              <p style={{ fontSize: 26, fontWeight: 700 }}>{money(summary.revenue)}</p>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <p style={{ fontSize: 12, color: 'var(--color-ink-soft)', marginBottom: 6 }}>Cost</p>
              <p style={{ fontSize: 26, fontWeight: 700 }}>{money(summary.cost)}</p>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <p style={{ fontSize: 12, color: 'var(--color-ink-soft)', marginBottom: 6 }}>Profit</p>
              <p style={{ fontSize: 26, fontWeight: 700, color: summary.profit >= 0 ? '#1a7a3c' : '#b3261e' }}>
                {money(summary.profit)}
              </p>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <p style={{ fontSize: 12, color: 'var(--color-ink-soft)', marginBottom: 6 }}>Clients</p>
              <p style={{ fontSize: 26, fontWeight: 700 }}>{summary.clientCount}</p>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <p style={{ fontSize: 12, color: 'var(--color-ink-soft)', marginBottom: 6 }}>Roosters listed</p>
              <p style={{ fontSize: 26, fontWeight: 700 }}>{summary.roosterCount}</p>
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ marginBottom: 14 }}>Orders by status</h3>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {Object.entries(summary.statusBreakdown).map(([status, count]) => (
                <div key={status} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 20, fontWeight: 700 }}>{count}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-ink-soft)', textTransform: 'capitalize' }}>
                    {status.replace(/_/g, ' ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'clients' && summary && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {summary.clients.length === 0 && <p style={{ color: 'var(--color-ink-soft)' }}>No clients yet.</p>}
          {summary.clients.map((c) => (
            <div key={c.email} className="card" style={{ padding: 18 }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, cursor: 'pointer' }}
                onClick={() => setExpandedClient(expandedClient === c.email ? null : c.email)}
              >
                <div>
                  <strong>{c.name}</strong>
                  <p style={{ fontSize: 13, color: 'var(--color-ink-soft)' }}>{c.email} · {c.phone}</p>
                </div>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 13, color: 'var(--color-ink-soft)' }}>{c.ordersCount} order{c.ordersCount !== 1 ? 's' : ''}</p>
                    <p style={{ fontWeight: 700 }}>{money(c.totalSpent)}</p>
                  </div>
                  <span style={{ fontSize: 12 }}>{expandedClient === c.email ? '▲' : '▼'}</span>
                </div>
              </div>
              {expandedClient === c.email && (
                <div style={{ marginTop: 14, borderTop: '1px solid var(--color-border, #e5e5e5)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {c.orders.map((o) => (
                    <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <span>{o.rooster} × {o.quantity} — {new Date(o.date).toLocaleDateString()}</span>
                      <span style={{ color: 'var(--color-ink-soft)', textTransform: 'capitalize' }}>{o.status.replace(/_/g, ' ')}</span>
                      <span style={{ fontWeight: 600 }}>{money(o.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'bookings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {bookings.length === 0 && <p style={{ color: 'var(--color-ink-soft)' }}>No bookings yet.</p>}
          {bookings.map((b) => (
            <div key={b._id} className="card" style={{ padding: 18, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <strong>{b.customerName}</strong> — {b.roosterNameAtBooking} × {b.quantity}
                <p style={{ fontSize: 13, color: 'var(--color-ink-soft)' }}>{b.email} · {b.phone}</p>
                <p style={{ fontSize: 13, color: 'var(--color-ink-soft)' }}>{b.deliveryAddress}</p>
                <p style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--color-ink-soft)' }}>
                  Preferred: {new Date(b.preferredDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <select value={b.status} onChange={(e) => handleStatusChange(b._id, e.target.value)}>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'inventory' && (
        <div>
          <form onSubmit={handleAddRooster} className="card" style={{ padding: 22, marginBottom: 28 }}>
            <h3 style={{ marginBottom: 16 }}>Add a rooster</h3>
            <div className="form-row-2">
              <div className="field">
                <label>Name</label>
                <input value={newRooster.name} onChange={(e) => setNewRooster({ ...newRooster, name: e.target.value })} required />
              </div>
              <div className="field">
                <label>Breed</label>
                <input value={newRooster.breed} onChange={(e) => setNewRooster({ ...newRooster, breed: e.target.value })} required />
              </div>
              <div className="field">
                <label>Age (months)</label>
                <input type="number" min="0" value={newRooster.ageMonths} onChange={(e) => setNewRooster({ ...newRooster, ageMonths: e.target.value })} required />
              </div>
              <div className="field">
                <label>Price (₱)</label>
                <input type="number" min="0" value={newRooster.price} onChange={(e) => setNewRooster({ ...newRooster, price: e.target.value })} required />
              </div>
              <div className="field">
                <label>Cost (₱)</label>
                <input type="number" min="0" value={newRooster.cost} onChange={(e) => setNewRooster({ ...newRooster, cost: e.target.value })} placeholder="What it costs you" required />
              </div>
              <div className="field">
                <label>Stock</label>
                <input type="number" min="0" value={newRooster.stock} onChange={(e) => setNewRooster({ ...newRooster, stock: e.target.value })} required />
              </div>
              <div className="field">
                <label>Photo (optional)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 10,
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: 'linear-gradient(135deg, #f0e9d6, #e7dfc8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--color-border, #e5e5e5)',
                    }}
                  >
                    {newRooster.imageUrl ? (
                      <img src={assetUrl(newRooster.imageUrl)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: 11, color: 'var(--color-ink-soft)' }}>No photo</span>
                    )}
                  </div>
                  <label className="btn btn-outline" style={{ padding: '9px 14px', fontSize: 13, cursor: 'pointer', margin: 0 }}>
                    {uploadingNew ? 'Uploading…' : 'Choose photo'}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleNewRoosterPhoto}
                      disabled={uploadingNew}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="field">
              <label>Description</label>
              <textarea rows={2} value={newRooster.description} onChange={(e) => setNewRooster({ ...newRooster, description: e.target.value })} />
            </div>
            <button className="btn btn-primary" disabled={uploadingNew}>Add Rooster</button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {roosters.map((r) => (
              <div key={r._id} className="card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: 'linear-gradient(135deg, #f0e9d6, #e7dfc8)',
                    }}
                  >
                    {r.imageUrl && (
                      <img src={assetUrl(r.imageUrl)} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                  <div>
                    <strong>{r.name}</strong> — {r.breed} · price {money(r.price)} · cost {money(r.cost)} · profit {money(r.price - (r.cost || 0))} · stock {r.stock}
                    {!r.available && <span className="tag" style={{ marginLeft: 8, borderColor: '#ccc', color: '#999' }}>unavailable</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <label className="btn btn-outline" style={{ padding: '7px 12px', fontSize: 13, cursor: 'pointer', margin: 0 }}>
                    {uploadingId === r._id ? 'Uploading…' : 'Change photo'}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => handleExistingRoosterPhoto(r, e)}
                      disabled={uploadingId === r._id}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <button className="btn btn-outline" style={{ padding: '7px 12px', fontSize: 13 }} onClick={() => handleToggleAvailable(r)}>
                    {r.available ? 'Mark Unavailable' : 'Mark Available'}
                  </button>
                  <button className="btn btn-outline" style={{ padding: '7px 12px', fontSize: 13 }} onClick={() => handleDeleteRooster(r._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
