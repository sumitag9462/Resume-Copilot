const User = require('../models/User');
const { validatePasswordPolicy, normalizeEmail } = require('./authController');

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (req.body.name && req.body.name.trim()) {
            user.name = req.body.name.trim();
        }
        if (req.body.email) {
            const normalized = normalizeEmail(req.body.email);
            if (normalized !== user.email) {
                const existing = await User.findOne({ email: normalized });
                if (existing) {
                    return res.status(400).json({ success: false, message: 'Email is already in use by another account' });
                }
                user.email = normalized;
                user.isVerified = false; // Require re-verification on email change
            }
        }
        if (req.body.mobile !== undefined) user.mobile = req.body.mobile;
        if (req.body.place !== undefined) user.place = req.body.place;
        if (req.body.careerStage !== undefined) user.careerStage = req.body.careerStage;
        if (req.body.desiredRole !== undefined) user.desiredRole = req.body.desiredRole;
        if (req.body.skills !== undefined) user.skills = req.body.skills;

        const updatedUser = await user.save();
        res.status(200).json({
            success: true,
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isVerified: updatedUser.isVerified !== false,
                settings: updatedUser.settings
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: 'Server error during profile update' });
    }
};

// @desc    Update user password
// @route   PUT /api/user/password
// @access  Private
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        const passwordPolicy = validatePasswordPolicy(newPassword);
        if (!passwordPolicy.valid) {
            return res.status(400).json({ success: false, message: passwordPolicy.message });
        }

        const userId = req.user._id || req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Incorrect current password', error: 'Incorrect current password' });
        }

        user.password = newPassword;
        user.passwordChangedAt = new Date();
        user.tokenVersion = (user.tokenVersion || 0) + 1; // Increment version to invalidate previous session tokens
        await user.save(); // pre-save hook handles bcrypt hashing

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({ success: false, message: 'Server error during password update' });
    }
};

// @desc    Update AI settings
// @route   PUT /api/user/settings/ai
// @access  Private
const updateAiSettings = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!user.settings) {
            user.settings = { ai: {}, notifications: {} };
        }
        if (!user.settings.ai) {
            user.settings.ai = {};
        }

        // Merge new AI settings
        user.settings.ai = { ...user.settings.ai, ...req.body };
        
        const updatedUser = await user.save();
        res.status(200).json({ success: true, settings: updatedUser.settings });
    } catch (error) {
        console.error('Update AI settings error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update notification settings
// @route   PUT /api/user/settings/notifications
// @access  Private
const updateNotificationSettings = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!user.settings) {
            user.settings = { ai: {}, notifications: {} };
        }
        if (!user.settings.notifications) {
            user.settings.notifications = {};
        }

        // Merge new notification settings
        user.settings.notifications = { ...user.settings.notifications, ...req.body };
        
        const updatedUser = await user.save();
        res.status(200).json({ success: true, settings: updatedUser.settings });
    } catch (error) {
        console.error('Update notification settings error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    updateProfile,
    updatePassword,
    updateAiSettings,
    updateNotificationSettings
};
