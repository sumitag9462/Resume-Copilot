const mongoose = require('mongoose');

const ContactQuerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'resolved'],
    default: 'unread'
  }
}, { timestamps: true });

module.exports = mongoose.model('ContactQuery', ContactQuerySchema);
