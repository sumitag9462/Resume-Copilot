const mongoose = require('mongoose');

const changeSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true
  },
  original: {
    type: String,
    default: ""
  },
  improved: {
    type: String,
    default: ""
  },
  type: {
    type: String,
    enum: ['added', 'modified', 'removed'],
    default: 'modified'
  },
  description: {
    type: String,
    default: ""
  }
});

const resumeBoostHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalResume: {
    type: String,
    required: true
  },
  improvedResume: {
    type: String,
    required: true
  },
  originalATS: {
    type: Number,
    required: true
  },
  improvedATS: {
    type: Number,
    required: true
  },
  changes: [changeSchema],
  recruiterFeedback: {
    type: String,
    default: ""
  },
  suggestions: {
    type: [String],
    default: []
  },
  keywordReport: {
    missing: {
      type: [String],
      default: []
    },
    added: {
      type: [String],
      default: []
    }
  },
  scores: {
    grammar: { type: Number, default: 0 },
    readability: { type: Number, default: 0 },
    keywordMatch: { type: Number, default: 0 },
    formatting: { type: Number, default: 0 },
    content: { type: Number, default: 0 },
    section: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ResumeBoostHistory', resumeBoostHistorySchema);
