const mongoose = require('mongoose');

const roosterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    breed: { type: String, required: true, trim: true },
    ageMonths: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    cost: { type: Number, required: true, min: 0, default: 0 },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    stock: { type: Number, required: true, default: 1, min: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rooster', roosterSchema);
