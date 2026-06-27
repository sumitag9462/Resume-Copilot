// ============================================================
// routes/voiceInterviewRoutes.js — VOICE INTERVIEW ROUTES
//
// Maps HTTP endpoints to controller functions.
// All routes are protected (require auth token).
// Start and message endpoints have rate limiting.
// Body size is increased for these routes since they carry
// resume text + JD + chat history.
// ============================================================

const express = require('express');
const router = express.Router();
const {
  startInterviewSession,
  sendInterviewMessage,
  streamInterviewMessage,
  endInterviewSession,
  getInterviewHistory,
  getInterviewSession,
  deleteInterviewSession
} = require('../controllers/voiceInterviewController');
const { protect } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

// Rate limiter: 20 requests per 15 minutes for AI-heavy operations
const interviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many interview requests. Please wait before trying again.' }
});

// Core interview flow
router.post('/start',   protect, interviewLimiter, startInterviewSession);
router.post('/message', protect, interviewLimiter, sendInterviewMessage);
router.post('/message-stream', protect, interviewLimiter, streamInterviewMessage);
router.post('/end',     protect, endInterviewSession);

// History management
router.get('/history',      protect, getInterviewHistory);
router.get('/history/:id',  protect, getInterviewSession);
router.delete('/history/:id', protect, deleteInterviewSession);

module.exports = router;
