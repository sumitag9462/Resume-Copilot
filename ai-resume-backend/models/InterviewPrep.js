const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: String,
  difficulty: String,
  question: String,
  expectedAnswer: String,
  keywords: [String],
  followup: String
});

const interviewPrepSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resume: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  jd: {
    type: String,
    default: ""
  },
  questions: [questionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('InterviewPrep', interviewPrepSchema);
