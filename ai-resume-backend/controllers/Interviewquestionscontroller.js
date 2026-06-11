// ─────────────────────────────────────────────────
// controllers/interviewQuestionsController.js
// ─────────────────────────────────────────────────

const { generateInterviewQuestions } = require("../services/interviewQuestionsService");
const Resume = require("../models/Resume");

// POST /api/interview-questions/generate
// Body: { resumeId, jobDescription, jobRole }  ← resumeId from their existing uploads
const generateQuestions = async (req, res) => {
  try {
    const { resumeId, jobDescription, jobRole } = req.body;
    const userId = req.user.id;

    if (!resumeId) {
      return res.status(400).json({ success: false, message: "resumeId is required." });
    }

    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found." });
    }

    const data = await generateInterviewQuestions(
      resume.extractedText,
      jobDescription || "",
      jobRole || ""
    );

    return res.status(200).json({
      success: true,
      data,
      resumeName: resume.fileName || resume.originalName,
    });
  } catch (error) {
    console.error("Interview questions error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/interview-questions/generate-from-text
// For users who want to paste text directly (no prior upload needed)
const generateQuestionsFromText = async (req, res) => {
  try {
    const { resumeText, jobDescription, jobRole } = req.body;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ success: false, message: "Please provide resume text." });
    }

    const data = await generateInterviewQuestions(resumeText, jobDescription || "", jobRole || "");
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Interview questions error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { generateQuestions, generateQuestionsFromText };


// ─────────────────────────────────────────────────
// routes/interviewQuestionsRoutes.js  (save separately)
//
// In app.js add:
//   const interviewRoutes = require('./routes/interviewQuestionsRoutes');
//   app.use('/api/interview-questions', interviewRoutes);
// ─────────────────────────────────────────────────
/*
const express = require("express");
const router = express.Router();
const { generateQuestions, generateQuestionsFromText } = require("../controllers/interviewQuestionsController");
const { protect } = require("../middleware/authMiddleware");

router.post("/generate", protect, generateQuestions);                  // from saved resume
router.post("/generate-from-text", protect, generateQuestionsFromText); // from pasted text

module.exports = router;
*/