const express = require('express');
const router = express.Router();
const outreachService = require('../services/outreachService');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/outreach/generate
// @desc    Generate cold email and LinkedIn connection request
// @access  Private
router.post('/generate', protect, async (req, res) => {
  try {
    const { targetRole, companyName, tone } = req.body;

    if (!targetRole || !companyName) {
      return res.status(400).json({ success: false, message: 'Please provide targetRole and companyName' });
    }

    const data = await outreachService.generateOutreachContent(req.user, {
      targetRole,
      companyName,
      tone,
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
