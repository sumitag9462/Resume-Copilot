const express = require('express');
const router = express.Router();
const outreachService = require('../services/outreachService');
const Resume = require('../models/Resume');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/outreach/generate
// @desc    Generate cold email and LinkedIn connection request
// @access  Private
router.post('/generate', protect, async (req, res) => {
  try {
    const { targetRole, companyName, tone, resumeId } = req.body;

    if (!targetRole || !companyName || !resumeId) {
      return res.status(400).json({ success: false, message: 'Please provide targetRole, companyName, and resumeId' });
    }

    const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found or access denied' });
    }

    const data = await outreachService.generateOutreachContent(req.user, {
      targetRole,
      companyName,
      tone,
      resumeText: resume.extractedText
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Outreach Route Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error while generating outreach content' });
  }
});

module.exports = router;
