const express = require('express');
const Booking = require('../models/Booking');
const Rooster = require('../models/Rooster');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.post('/login', (req, res) => {
  const { passcode } = req.body;
  if (passcode && passcode === process.env.ADMIN_PASSCODE) {
    return res.json({ success: true });
  }
  res.status(401).json({ error: 'Incorrect passcode.' });
});

router.get('/summary', requireAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    const statusBreakdown = {
      pending: 0,
      confirmed: 0,
      out_for_delivery: 0,
      delivered: 0,
      cancelled: 0,
    };

    let revenue = 0;
    let cost = 0;
    const clientsByEmail = new Map();

    for (const b of bookings) {
      statusBreakdown[b.status] = (statusBreakdown[b.status] || 0) + 1;

      const lineRevenue = (b.priceAtBooking || 0) * b.quantity;
      const lineCost = (b.costAtBooking || 0) * b.quantity;
      const counted = b.status !== 'cancelled';
      if (counted) {
        revenue += lineRevenue;
        cost += lineCost;
      }

      const key = b.email;
      if (!clientsByEmail.has(key)) {
        clientsByEmail.set(key, {
          name: b.customerName,
          email: b.email,
          phone: b.phone,
          ordersCount: 0,
          totalSpent: 0,
          lastOrderDate: b.createdAt,
          orders: [],
        });
      }
      const client = clientsByEmail.get(key);
      client.ordersCount += 1;
      if (counted) client.totalSpent += lineRevenue;
      if (b.createdAt > client.lastOrderDate) client.lastOrderDate = b.createdAt;
      client.orders.push({
        id: b._id,
        rooster: b.roosterNameAtBooking,
        quantity: b.quantity,
        amount: lineRevenue,
        status: b.status,
        date: b.createdAt,
      });
    }

    const roosterCount = await Rooster.countDocuments();

    res.json({
      totalOrders: bookings.length,
      statusBreakdown,
      revenue,
      cost,
      profit: revenue - cost,
      clientCount: clientsByEmail.size,
      roosterCount,
      clients: Array.from(clientsByEmail.values()).sort(
        (a, b) => new Date(b.lastOrderDate) - new Date(a.lastOrderDate)
      ),
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not load dashboard summary.', details: err.message });
  }
});

module.exports = router;
