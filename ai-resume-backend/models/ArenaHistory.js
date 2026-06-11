// models/ArenaHistory.js — ARENA HISTORY SCHEMA
//
// Persists the results of all AI Model Arena runs.
// Stores parallel model outputs, execution times, token usages, and engine scores.

const mongoose = require('mongoose');

const arenaResultSchema = new mongoose.Schema({
  model: {
    type: String,
    required: true
  },
  output: {
    type: mongoose.Schema.Types.Mixed // JSON objects matching feature schemas
  },
  executionTime: {
    type: Number, // in milliseconds
    default: 0
  },
  tokenUsage: {
    promptTokens: { type: Number, default: 0 },
    completionTokens: { type: Number, default: 0 },
    totalTokens: { type: Number, default: 0 }
  },
  scores: {
    grammar: { type: Number, default: 0 },
    readability: { type: Number, default: 0 },
    keywordDensity: { type: Number, default: 0 },
    ats: { type: Number, default: 0 },
    professionalism: { type: Number, default: 0 },
    completeness: { type: Number, default: 0 },
    practicality: { type: Number, default: 0 },
    overall: { type: Number, default: 0 }
  },
  error: {
    type: String,
    default: null
  }
});

const arenaHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    feature: {
      type: String,
      required: true // e.g. 'ats_analysis', 'jd_match', etc.
    },
    input: {
      type: mongoose.Schema.Types.Mixed, // Inputs supplied: { resumeText, jdText, style, role, etc. }
      required: true
    },
    selectedModel: {
      type: String, // 'auto' or a specific model name like 'gemini-2.5-flash'
      required: true
    },
    compareMode: {
      type: Boolean, // True if run in parallel comparison mode
      required: true
    },
    results: [arenaResultSchema], // Results for each model that ran
    winner: {
      type: String, // Model name that won overall (e.g. 'gemini-pro')
      default: null
    },
    bestResults: {
      bestOverall: { type: String, default: null },
      bestATS: { type: String, default: null },
      bestGrammar: { type: String, default: null },
      bestRecruiter: { type: String, default: null },
      bestSpeed: { type: String, default: null }
    }
  },
  {
    timestamps: true
  }
);

// Compound index for fast lookup of a user's logs filtered by feature or sorted by recency
arenaHistorySchema.index({ userId: 1, feature: 1, createdAt: -1 });
arenaHistorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.models.ArenaHistory || mongoose.model('ArenaHistory', arenaHistorySchema);
