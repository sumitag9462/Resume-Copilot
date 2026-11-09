const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/authMiddleware');
const {
    registerUser,
    requestEmailOtp,
    verifyEmailOtp,
    loginUser,
    logoutUser,
    requestPasswordResetOtp,
    verifyPasswordResetOtp,
    resetPassword,
    getProfile,
    googleLogin
} = require('../controllers/authController');

// Rate limiter for OTP operations: max 15 requests per 15 minutes
const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: { success: false, message: 'Too many requests for verification codes. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'test' // Bypass in test suites to prevent flakiness
});

router.post('/register', registerUser);
router.post('/request-email-otp', otpLimiter, requestEmailOtp);

router.post('/verify-otp', otpLimiter, verifyEmailOtp);
router.post('/verify-email-otp', otpLimiter, verifyEmailOtp);

router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/logout', logoutUser);

router.post('/forgot-password', otpLimiter, requestPasswordResetOtp);
router.post('/request-password-reset-otp', otpLimiter, requestPasswordResetOtp);

router.post('/verify-reset-otp', otpLimiter, verifyPasswordResetOtp);
router.post('/verify-password-reset-otp', otpLimiter, verifyPasswordResetOtp);

router.post('/reset-password', resetPassword);
router.get('/me', protect, getProfile);

module.exports = router;
