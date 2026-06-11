const mongoose = require('mongoose');

const resumeBoostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalBullet: {
    type: String,
    required: true
  },
  enhancedBullet: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ResumeBoost', resumeBoostSchema);
