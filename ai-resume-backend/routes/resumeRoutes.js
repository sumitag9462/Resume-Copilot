// ============================================================
// routes/resumeRoutes.js — RESUME ROUTES
//
// All routes here are prefixed with /api/resume (registered in app.js)
// All routes require the user to be authenticated.
// ============================================================

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  uploadResume,
  getAllResumes,
  getResume,
  deleteResume,
} = require('../controllers/resumecontrollers');
const upload = require('../middleware/uploadMiddleware');

const { enhanceSingle, scanWeakLanguage } = require('../controllers/resumeBoostController');
const { rebuildResume, getRebuildHistory, deleteRebuildHistory } = require('../controllers/resumeRebuildController');
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: "Too many requests, please try again later." }
});

router.use(protect);

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/all', getAllResumes);
router.get('/history', getRebuildHistory);
router.delete('/history/:id', deleteRebuildHistory);
router.get('/:id', getResume);
router.delete('/:id', deleteResume);

router.post('/enhance', apiLimiter, enhanceSingle);
router.post('/scan', apiLimiter, scanWeakLanguage);
router.post('/rebuild', apiLimiter, rebuildResume);

module.exports = router;
