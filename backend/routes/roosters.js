const express = require('express');
const Rooster = require('../models/Rooster');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const { includeUnavailable } = req.query;
    const filter = includeUnavailable === 'true' ? {} : { available: true };
    const roosters = await Rooster.find(filter).sort({ createdAt: -1 });
    res.json(roosters);
  } catch (err) {
    res.status(500).json({ error: 'Could not load roosters.', details: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const rooster = await Rooster.findById(req.params.id);
    if (!rooster) return res.status(404).json({ error: 'Rooster not found.' });
    res.json(rooster);
  } catch (err) {
    res.status(400).json({ error: 'Invalid rooster id.' });
  }
});


router.post('/', requireAdmin, async (req, res) => {
  try {
    const rooster = await Rooster.create(req.body);
    res.status(201).json(rooster);
  } catch (err) {
    res.status(400).json({ error: 'Could not create rooster.', details: err.message });
  }
});


router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const rooster = await Rooster.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!rooster) return res.status(404).json({ error: 'Rooster not found.' });
    res.json(rooster);
  } catch (err) {
    res.status(400).json({ error: 'Could not update rooster.', details: err.message });
  }
});


router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const rooster = await Rooster.findByIdAndDelete(req.params.id);
    if (!rooster) return res.status(404).json({ error: 'Rooster not found.' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Could not delete rooster.', details: err.message });
  }
});

module.exports = router;
