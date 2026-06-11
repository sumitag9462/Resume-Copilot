// ─────────────────────────────────────────────────
// routes/weakLanguageRoutes.js
// Drop into your existing routes/ folder
//
// Then in app.js add:
//   const weakLanguageRoutes = require('./routes/weakLanguageRoutes');
//   app.use('/api/weak-language', weakLanguageRoutes);
// ─────────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const { analyzeText, analyzeByResumeId } = require("../controllers/weakLanguageController");
const { protect } = require("../middleware/authMiddleware"); // your existing middleware

router.post("/text", protect, analyzeText);                      // paste raw text
router.get("/resume/:resumeId", protect, analyzeByResumeId);     // by uploaded resume

module.exports = router;