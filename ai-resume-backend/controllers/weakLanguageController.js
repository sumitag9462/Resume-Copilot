// ─────────────────────────────────────────────────
// controllers/weakLanguageController.js
// Drop into your existing controllers/ folder
// Assumes your Resume model has a field: extractedText
// ─────────────────────────────────────────────────

const { analyzeWeakLanguage } = require("../services/weakLanguageService");
const Resume = require("../models/Resume"); // adjust path if your model name differs

// POST /api/weak-language/text
// Body: { text: "..." }  ← user pastes resume text directly
const analyzeText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least 20 characters of resume text.",
      });
    }

    const result = await analyzeWeakLanguage(text);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Weak language analysis error:", error.message);
    return res.status(500).json({ success: false, message: "Analysis failed.", error: error.message });
  }
};

// GET /api/weak-language/resume/:resumeId
// Analyzes an already-uploaded resume from MongoDB
const analyzeByResumeId = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found." });
    }

    if (!resume.extractedText) {
      return res.status(400).json({ success: false, message: "No text found for this resume." });
    }

    const result = await analyzeWeakLanguage(resume.extractedText);

    return res.status(200).json({
      success: true,
      data: result,
      resumeName: resume.fileName || resume.originalName,
    });
  } catch (error) {
    console.error("Weak language analysis error:", error.message);
    return res.status(500).json({ success: false, message: "Analysis failed.", error: error.message });
  }
};

module.exports = { analyzeText, analyzeByResumeId };