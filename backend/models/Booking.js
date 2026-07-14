const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    rooster: { type: mongoose.Schema.Types.ObjectId, ref: 'Rooster', required: true },
    roosterNameAtBooking: { type: String, required: true },
    priceAtBooking: { type: Number, required: true, min: 0, default: 0 },
    costAtBooking: { type: Number, required: true, min: 0, default: 0 },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    deliveryAddress: { type: String, required: true },
    preferredDate: { type: Date, required: true },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
