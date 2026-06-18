// routes/copilotRoutes.js
const express = require('express');
const router = express.Router();
const { 
  streamChat, 
  generateTitle,
  getSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession
} = require('../controllers/copilotController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/copilot/chat   — streams Gemini response as SSE
router.post('/chat', protect, streamChat);

// POST /api/copilot/title  — generates a conversation title
router.post('/title', protect, generateTitle);

// CRUD for Chat History
router.route('/sessions')
  .get(protect, getSessions)
  .post(protect, createSession);

router.route('/sessions/:id')
  .get(protect, getSession)
  .put(protect, updateSession)
  .delete(protect, deleteSession);

module.exports = router;
