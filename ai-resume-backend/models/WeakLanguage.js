const mongoose = require('mongoose');

const weakLanguageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weakPhrase: {
    type: String,
    required: true
  },
  improvedPhrase: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WeakLanguage', weakLanguageSchema);
