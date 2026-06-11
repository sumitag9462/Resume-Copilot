// ============================================================
// models/Resume.js — RESUME SCHEMA
//
// Stores metadata + extracted text of uploaded resumes.
// Each resume "belongs to" a user via the `user` field,
// which stores a reference (ObjectId) to the User document.
//
// KEY CONCEPT: `ref: 'User'` enables Mongoose's populate() feature.
// Instead of storing the whole user object, we store just the _id.
// When we need user data, we call .populate('user') to join them.
//
// We store `extractedText` so we don't have to re-parse the file
// every time we want to run an AI analysis.
// ============================================================

const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',     // Reference to the User model
      required: true
    },
    fileName: {
      type:     String,
      required: true        // System-generated filename (e.g., userId-timestamp.pdf)
    },
    originalName: {
      type:     String,
      required: true        // What the user named their file (e.g., "My_Resume.pdf")
    },
    fileType: {
      type:     String,
      enum:     ['pdf', 'docx'],  // Only allow these two values
      required: true
    },
    filePath: {
      type:     String,
      required: true        // Full path on disk (e.g., "uploads/resumes/userId-timestamp.pdf")
    },
    extractedText: {
      type:     String,
      required: true        // Raw text extracted from PDF/DOCX by our fileParser util
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);