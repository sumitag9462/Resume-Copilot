// ─────────────────────────────────────────────────
// routes/interviewQuestionsRoutes.js
// In app.js add:
//   const interviewRoutes = require('./routes/interviewQuestionsRoutes');
//   app.use('/api/interview-questions', interviewRoutes);
// ─────────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const { generateQuestions, generateQuestionsFromText } = require("../controllers/interviewQuestionsController");
const { protect } = require("../middleware/authMiddleware");

router.post("/generate", protect, generateQuestions);                   // from saved resume ID
router.post("/generate-from-text", protect, generateQuestionsFromText); // from pasted text

module.exports = router;