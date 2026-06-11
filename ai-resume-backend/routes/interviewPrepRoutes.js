const express = require("express");
const router = express.Router();
const {
  generateQuestions,
  regenerateQuestions,
  getHistory,
  deleteHistory
} = require("../controllers/interviewPrepController");
const { protect } = require("../middleware/authMiddleware");
const rateLimit = require("express-rate-limit");

// Rate limiters for heavier generation operations
const generationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window
  message: { success: false, message: "Too many requests, please try again later." }
});

// Mount endpoints with protection middleware
router.post("/generate", protect, generationLimiter, generateQuestions);
router.post("/regenerate", protect, generationLimiter, regenerateQuestions);
router.get("/history", protect, getHistory);
router.delete("/history/:id", protect, deleteHistory);

module.exports = router;
