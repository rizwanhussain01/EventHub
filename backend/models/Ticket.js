const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ticketId: {
    type: String,
    unique: true,
    required: true
  },

  // --- Personal details required for registration ---
  personalDetails: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    age: Number,
    gender: String,
    organization: String,
    specialRequirements: String
  },

  // --- QR Code for each ticket (base64 PNG Data URL) ---
  qrCode: {                   // <--- NEW FIELD (just add this)
    type: String
  },

  status: {
    type: String,
    enum: ['active', 'cancelled'],
    default: 'active'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent duplicate registrations for the same event/user
ticketSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Ticket', ticketSchema);
