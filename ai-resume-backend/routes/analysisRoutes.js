// ============================================================
// routes/analysisRoutes.js — ANALYSIS ROUTES
//
// All routes here are prefixed with /api/analysis (set in server.js)
// All routes require the `protect` middleware (JWT auth check).
//
// Final URLs:
//   POST /api/analysis/ats              → runATSAnalysis
//   POST /api/analysis/match            → matchWithJob
//   POST /api/analysis/cover-letter     → createCoverLetter
//   GET  /api/analysis/history/:resumeId → getHistory
//   GET  /api/analysis/:id              → getAnalysisById
//
// NOTE: /history/:resumeId MUST come BEFORE /:id in the route
// order, otherwise Express will try to match "history" as the :id
// parameter and call getAnalysisById instead.
// ============================================================

const express  = require('express');
const router   = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  runATSAnalysis,
  matchWithJob,
  createCoverLetter,
  getHistory,
  getAnalysisById,
} = require('../controllers/analysisController');

// All analysis routes require login
router.use(protect);

// ── ANALYSIS CREATION ROUTES ────────────────────────────────
router.post('/resume/:id/ats', runATSAnalysis);   // LEGACY alias for POST /api/analysis/ats
router.post('/ats',          runATSAnalysis);   // POST /api/analysis/ats
router.post('/match',        matchWithJob);     // POST /api/analysis/match
router.post('/cover',        createCoverLetter); // LEGACY alias for POST /api/analysis/cover-letter
router.post('/cover-letter', createCoverLetter);// POST /api/analysis/cover-letter

// ── HISTORY & SINGLE FETCH ──────────────────────────────────
// IMPORTANT: /history/:resumeId must come before /:id
router.get('/history/:resumeId', getHistory);      // GET /api/analysis/history/:resumeId
router.get('/:id',               getAnalysisById); // GET /api/analysis/:id

module.exports = router;