const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  expectedAnswer: {
    type: String,
    required: true
  },
  keywords: {
    type: [String],
    default: []
  },
  followup: {
    type: String,
    default: ""
  },
  tips: {
    type: String,
    default: ""
  }
});

const interviewHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    default: null
  },
  resume: {
    type: String,
    default: ""
  },
  role: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    default: ""
  },
  matchPercentage: {
    type: Number,
    default: 0
  },
  strongSkills: {
    type: [String],
    default: []
  },
  weakSkills: {
    type: [String],
    default: []
  },
  questions: [questionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('InterviewHistory', interviewHistorySchema);
