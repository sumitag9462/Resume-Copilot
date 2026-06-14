const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    updateProfile,
    updatePassword,
    updateAiSettings,
    updateNotificationSettings
} = require('../controllers/userController');

// All user routes require authentication
router.use(protect);

router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.put('/settings/ai', updateAiSettings);
router.put('/settings/notifications', updateNotificationSettings);

module.exports = router;
