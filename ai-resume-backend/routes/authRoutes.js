// routes/authRoutes.js
//
// FIX: require() path must EXACTLY match your filename on disk.
// JavaScript on Linux is case-sensitive. 'authcontrollers' and
// 'authController' are different files on Linux/Mac but the same
// on Windows — this will silently work locally but crash on any
// hosting platform (Render, Railway, VPS etc.)
//
// Check your actual filename and make sure the require path matches.
// If your file is named authController.js  → use '../controllers/authController'
// If your file is named authcontrollers.js → use '../controllers/authcontrollers'

const express = require('express');
const router  = express.Router();

const {
  register,
  login,
  verifyEmail,
  resendVerification,
  getMe
} = require('../controllers/authController'); // ← make sure this matches your filename

const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register',             register);
router.post('/login',                login);
router.post('/verify-email',         verifyEmail);       // stub — returns disabled message
router.post('/resend-verification',  resendVerification); // stub — returns disabled message

// Protected route — requires valid JWT
router.get('/me', protect, getMe);

module.exports = router;