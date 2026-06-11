// ============================================================
// models/Analysis.js — ANALYSIS SCHEMA
//
// One collection handles ALL 3 types of AI analysis:
//   1. 'ats_analysis'  → ATS score, keywords, suggestions
//   2. 'jd_match'      → Match score with a job description
//   3. 'cover_letter'  → Generated cover letter text
//
// The `type` field tells us which fields are populated.
// This is called a "polymorphic" schema pattern — one schema,
// multiple use cases. Simpler than creating 3 separate collections.
// ============================================================

const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    // ── COMMON FIELDS (in every analysis) ─────────────────
    resume: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Resume',
      required: true
    },
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true
    },
    type: {
      type:     String,
      enum:     ['ats_analysis', 'jd_match', 'cover_letter'],
      required: true
    },

    // ── ATS ANALYSIS FIELDS ───────────────────────────────
    atsScore:      Number,         // 0–100: how ATS-friendly the resume is
    overallScore:  Number,         // 0–100: general quality score
    missingKeywords: [String],     // Keywords found in typical JDs but not in resume
    suggestions:   [String],       // Actionable improvement tips
    grammarIssues: [String],       // Grammar/spelling issues detected
    sectionFeedback: {
      summary:    String,
      experience: String,
      education:  String,
      skills:     String,
      projects:   String
    },
    strengths:     [String],
    weaknesses:    [String],

    // ── JD MATCH FIELDS ──────────────────────────────────
    jobDescription:  String,       // The pasted job description text
    matchScore:      Number,       // 0–100: overall match percentage
    skillCoverage:   Number,       // 0–100: what % of required skills candidate has
    keywordCoverage: Number,       // 0–100: what % of JD keywords are in resume
    matchedSkills:   [String],     // Skills found in BOTH resume and JD
    missingSkills:   [String],     // Skills in JD but NOT in resume
    recommendations: [String],     // What to add/improve to increase match

    // ── COVER LETTER FIELDS ───────────────────────────────
    companyName:        String,
    jobRole:            String,
    style: {
      type: String,
      enum: ['professional', 'formal', 'startup', 'creative']
    },
    coverLetterContent: String     // The full generated cover letter text
  },
  {
    timestamps: true
  }
);

// ── INDEX for faster queries ─────────────────────────────
// When frontend fetches history for a resume, MongoDB can find it
// quickly using this compound index instead of scanning all docs.
analysisSchema.index({ resume: 1, user: 1, createdAt: -1 });

module.exports = mongoose.models.Analysis || mongoose.model('Analysis', analysisSchema);