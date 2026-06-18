// ============================================================
// models/VoiceInterviewSession.js — VOICE INTERVIEW SESSION
//
// Stores the full state of an AI voice interview session:
//   - Resume, JD, and company context
//   - Full chat history (user + model turns)
//   - Hidden evaluation scorecard (10 dimensions)
//   - Session metadata (timing, status, question count)
//
// The evaluation object is populated ONLY when the interview
// ends — it is never exposed to the user mid-interview.
// ============================================================

const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'model'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const scoreDimensionSchema = new mongoose.Schema({
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  }
}, { _id: false });

const evaluationSchema = new mongoose.Schema({
  technical:          { type: scoreDimensionSchema, default: () => ({}) },
  communication:      { type: scoreDimensionSchema, default: () => ({}) },
  confidence:         { type: scoreDimensionSchema, default: () => ({}) },
  leadership:         { type: scoreDimensionSchema, default: () => ({}) },
  problemSolving:     { type: scoreDimensionSchema, default: () => ({}) },
  behavior:           { type: scoreDimensionSchema, default: () => ({}) },
  cultureFit:         { type: scoreDimensionSchema, default: () => ({}) },
  resumeAuthenticity: { type: scoreDimensionSchema, default: () => ({}) },
  domainKnowledge:    { type: scoreDimensionSchema, default: () => ({}) },
  overallScore:       { type: Number, min: 0, max: 100, default: 0 },
  strengths:          { type: [String], default: [] },
  weaknesses:         { type: [String], default: [] },
  hiringDecision:     { type: String, default: '' },
  recommendation:     { type: String, default: '' },
  improvementAreas:   { type: [String], default: [] }
}, { _id: false });

const voiceInterviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeText: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  companyMode: {
    type: String,
    enum: ['General', 'Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Stripe', 'OpenAI', 'Adobe'],
    default: 'General'
  },
  interviewType: {
    type: String,
    enum: ['Behavioral', 'Technical', 'Recruiter', 'Hiring Manager'],
    default: 'Technical'
  },
  difficultyLevel: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  },
  chatHistory: {
    type: [chatMessageSchema],
    default: []
  },
  evaluation: {
    type: evaluationSchema,
    default: () => ({})
  },
  questionCount: {
    type: Number,
    default: 0
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // adds createdAt, updatedAt
});

// Index for efficient user history queries
voiceInterviewSessionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('VoiceInterviewSession', voiceInterviewSessionSchema);
