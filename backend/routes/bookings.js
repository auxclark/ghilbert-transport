const express = require('express');
const Booking = require('../models/Booking');
const Rooster = require('../models/Rooster');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();


router.post('/', async (req, res) => {
  try {
    const { roosterId, quantity, customerName, email, phone, deliveryAddress, preferredDate, notes } =
      req.body;

    const rooster = await Rooster.findById(roosterId);
    if (!rooster) return res.status(404).json({ error: 'Selected rooster was not found.' });
    if (!rooster.available || rooster.stock < quantity) {
      return res.status(400).json({ error: 'Not enough stock available for this rooster.' });
    }

    const booking = await Booking.create({
      rooster: rooster._id,
      roosterNameAtBooking: rooster.name,
      priceAtBooking: rooster.price,
      costAtBooking: rooster.cost || 0,
      quantity,
      customerName,
      email,
      phone,
      deliveryAddress,
      preferredDate,
      notes,
    });

    rooster.stock -= quantity;
    if (rooster.stock <= 0) rooster.available = false;
    await rooster.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: 'Could not create booking.', details: err.message });
  }
});


router.get('/lookup', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email is required.' });
    const bookings = await Booking.find({ email: email.toLowerCase() }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Could not look up bookings.', details: err.message });
  }
});


router.get('/', requireAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('rooster').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Could not load bookings.', details: err.message });
  }
});


router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: 'Could not update booking.', details: err.message });
  }
});

module.exports = router;
