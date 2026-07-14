const API_ORIGIN = import.meta.env.VITE_API_URL || '';
const BASE = `${API_ORIGIN}/api`;

export function assetUrl(path) {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;
  return `${API_ORIGIN}${path}`;
}

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }
  return data;
}

export const api = {
  getRoosters: (includeUnavailable = false) =>
    fetch(`${BASE}/roosters${includeUnavailable ? '?includeUnavailable=true' : ''}`).then(handle),

  getRooster: (id) => fetch(`${BASE}/roosters/${id}`).then(handle),

  createRooster: (passcode, payload) =>
    fetch(`${BASE}/roosters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-passcode': passcode },
      body: JSON.stringify(payload),
    }).then(handle),

  updateRooster: (passcode, id, payload) =>
    fetch(`${BASE}/roosters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-passcode': passcode },
      body: JSON.stringify(payload),
    }).then(handle),

  deleteRooster: (passcode, id) =>
    fetch(`${BASE}/roosters/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-passcode': passcode },
    }).then(handle),

  createBooking: (payload) =>
    fetch(`${BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handle),

  lookupBookings: (email) =>
    fetch(`${BASE}/bookings/lookup?email=${encodeURIComponent(email)}`).then(handle),

  adminLogin: (passcode) =>
    fetch(`${BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode }),
    }).then(handle),

  getAllBookings: (passcode) =>
    fetch(`${BASE}/bookings`, { headers: { 'x-admin-passcode': passcode } }).then(handle),

  getSummary: (passcode) =>
    fetch(`${BASE}/admin/summary`, { headers: { 'x-admin-passcode': passcode } }).then(handle),

  uploadImage: (passcode, file) => {
    const formData = new FormData();
    formData.append('image', file);
    return fetch(`${BASE}/upload`, {
      method: 'POST',
      headers: { 'x-admin-passcode': passcode },
      body: formData,
    }).then(handle);
  },

  updateBookingStatus: (passcode, id, status) =>
    fetch(`${BASE}/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-passcode': passcode },
      body: JSON.stringify({ status }),
    }).then(handle),
};
