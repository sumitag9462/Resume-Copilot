const mongoose = require('mongoose');

const ContactQuerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 120,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 2000,
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'resolved'],
    default: 'unread'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 90 // 90 days automatic TTL retention cleanup (A39)
  }
}, { timestamps: true });

ContactQuerySchema.index({ createdAt: -1 });

module.exports = mongoose.model('ContactQuery', ContactQuerySchema);
