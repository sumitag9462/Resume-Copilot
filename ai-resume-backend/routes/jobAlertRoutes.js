const express = require('express');
const router = express.Router();
const JobAlert = require('../models/JobAlert');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/job-alerts/subscribe
// @desc    Create a new job alert subscription
// @access  Private
router.post('/subscribe', protect, async (req, res) => {
  try {
    const { jobTitle, location, frequency } = req.body;

    if (!jobTitle || !location) {
      return res.status(400).json({ success: false, message: 'Please provide jobTitle and location' });
    }

    const jobAlert = await JobAlert.create({
      userId: req.user._id,
      jobTitle,
      location,
      frequency: frequency || 'daily',
    });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to job alerts',
      data: jobAlert,
    });
  } catch (error) {
    console.error('Job Alert Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error while creating job alert' });
  }
});

// @route   GET /api/job-alerts
// @desc    Get user's job alerts
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const alerts = await JobAlert.find({ userId: req.user._id });
    res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    console.error('Job Alert Fetch Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error while fetching job alerts' });
  }
});

// @route   DELETE /api/job-alerts/:id
// @desc    Delete a job alert
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const alert = await JobAlert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    if (alert.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await JobAlert.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Alert removed' });
  } catch (error) {
    console.error('Job Alert Delete Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error while deleting job alert' });
  }
});

module.exports = router;
