const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    requestEmailOtp,
    verifyEmailOtp,
    loginUser,
    logoutUser,
    requestPasswordResetOtp,
    verifyPasswordResetOtp,
    resetPassword,
    getProfile
} = require('../controllers/authController');

router.post('/register', requestEmailOtp);
router.post('/request-email-otp', requestEmailOtp);

router.post('/verify-otp', verifyEmailOtp);
router.post('/verify-email-otp', verifyEmailOtp);

router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.post('/forgot-password', requestPasswordResetOtp);
router.post('/request-password-reset-otp', requestPasswordResetOtp);

router.post('/verify-reset-otp', verifyPasswordResetOtp);
router.post('/verify-password-reset-otp', verifyPasswordResetOtp);

router.post('/reset-password', resetPassword);
router.get('/me', protect, getProfile);

module.exports = router;