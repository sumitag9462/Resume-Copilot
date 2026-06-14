const User = require('../models/User');

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        user.name = req.body.name || user.name;
        // user.photo = req.body.photo || user.photo; // Optional

        const updatedUser = await user.save();
        res.status(200).json({
            success: true,
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                settings: updatedUser.settings
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// @desc    Update user password
// @route   PUT /api/user/password
// @access  Private
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, error: 'Please provide all required fields' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Incorrect current password' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// @desc    Update AI settings
// @route   PUT /api/user/settings/ai
// @access  Private
const updateAiSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
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
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// @desc    Update notification settings
// @route   PUT /api/user/settings/notifications
// @access  Private
const updateNotificationSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
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
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

module.exports = {
    updateProfile,
    updatePassword,
    updateAiSettings,
    updateNotificationSettings
};
