import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../api';

const emptyForm = {
  roosterId: '',
  quantity: 1,
  customerName: '',
  email: '',
  phone: '',
  deliveryAddress: '',
  preferredDate: '',
  notes: '',
};

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [roosters, setRoosters] = useState([]);
  const [form, setForm] = useState({ ...emptyForm, roosterId: searchParams.get('roosterId') || '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getRoosters().then(setRoosters).catch(() => {});
  }, []);

  const selectedRooster = roosters.find((r) => r._id === form.roosterId);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const e = {};
    if (!form.roosterId) e.roosterId = 'Please choose a rooster.';
    if (!form.customerName.trim()) e.customerName = 'Your name is required.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.phone.trim()) e.phone = 'A contact number is required.';
    if (!form.deliveryAddress.trim()) e.deliveryAddress = 'Delivery address is required.';
    if (!form.preferredDate) e.preferredDate = 'Choose a preferred delivery date.';
    if (form.quantity < 1) e.quantity = 'Quantity must be at least 1.';
    if (selectedRooster && form.quantity > selectedRooster.stock) {
      e.quantity = `Only ${selectedRooster.stock} in stock.`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const booking = await api.createBooking({ ...form, quantity: Number(form.quantity) });
      navigate(`/confirmation/${booking._id}`, { state: { booking } });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container" style={{ padding: '48px 24px 80px', maxWidth: 720 }}>
      <span className="eyebrow">Booking</span>
      <h1 style={{ fontSize: 'clamp(26px, 4.5vw, 32px)', margin: '10px 0 8px' }}>Book your rooster delivery</h1>
      <p style={{ color: 'var(--color-ink-soft)', marginBottom: 32 }}>
        Fill in the details below. We'll confirm your booking and deliver to the address you provide.
      </p>

      {submitError && <p className="alert alert-error">{submitError}</p>}

      <form onSubmit={handleSubmit} className="card" style={{ padding: 28 }}>
        <div className="field">
          <label htmlFor="roosterId">Rooster</label>
          <select id="roosterId" value={form.roosterId} onChange={(e) => update('roosterId', e.target.value)}>
            <option value="">Select a rooster…</option>
            {roosters.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name} — {r.breed} (₱{r.price.toLocaleString()})
              </option>
            ))}
          </select>
          {errors.roosterId && <span className="field-error">{errors.roosterId}</span>}
        </div>

        <div className="field">
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            min="1"
            value={form.quantity}
            onChange={(e) => update('quantity', e.target.value)}
          />
          {errors.quantity && <span className="field-error">{errors.quantity}</span>}
        </div>

        <div className="form-row-2">
          <div className="field">
            <label htmlFor="customerName">Full name</label>
            <input id="customerName" value={form.customerName} onChange={(e) => update('customerName', e.target.value)} />
            {errors.customerName && <span className="field-error">{errors.customerName}</span>}
          </div>
          <div className="field">
            <label htmlFor="phone">Phone number</label>
            <input id="phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>
        </div>

        <div className="field">
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
          {errors.email && <span className="field-error">{errors.email}</span>}
          <span style={{ fontSize: 12, color: 'var(--color-ink-soft)' }}>Used to track your booking later.</span>
        </div>

        <div className="field">
          <label htmlFor="deliveryAddress">Delivery address</label>
          <textarea
            id="deliveryAddress"
            rows={3}
            value={form.deliveryAddress}
            onChange={(e) => update('deliveryAddress', e.target.value)}
          />
          {errors.deliveryAddress && <span className="field-error">{errors.deliveryAddress}</span>}
        </div>

        <div className="field">
          <label htmlFor="preferredDate">Preferred delivery date</label>
          <input
            id="preferredDate"
            type="date"
            value={form.preferredDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => update('preferredDate', e.target.value)}
          />
          {errors.preferredDate && <span className="field-error">{errors.preferredDate}</span>}
        </div>

        <div className="field">
          <label htmlFor="notes">Notes (optional)</label>
          <textarea id="notes" rows={2} value={form.notes} onChange={(e) => update('notes', e.target.value)} />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
          {submitting ? 'Booking…' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
}
