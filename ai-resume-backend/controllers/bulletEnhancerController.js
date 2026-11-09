// controllers/bulletEnhancerController.js
// Resume Bullet Enhancement Controller

const { enhanceBullet, enhanceBulkBullets } = require("../services/bulletEnhancerService");
const { isSafeString, validateArrayOfStrings } = require("../utils/validationHelper");

// POST /api/bullets/enhance
// Body: { bullet: "helped with login page", jobRole: "Frontend Developer" }
const enhanceSingle = async (req, res) => {
  try {
    const { bullet, jobRole } = req.body;

    if (!isSafeString(bullet, 5, 1000)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid bullet point string between 5 and 1000 characters."
      });
    }

    if (jobRole !== undefined && typeof jobRole !== 'string') {
      return res.status(400).json({ success: false, message: "jobRole must be a string." });
    }

    const data = await enhanceBullet(bullet, jobRole);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error("Bullet enhance error:", error.message);
    }
    return res.status(500).json({ success: false, message: error.message || "Failed to enhance bullet." });
  }
};

// POST /api/bullets/enhance-bulk
// Body: { bullets: ["bullet1", "bullet2"], jobRole: "..." }
const enhanceBulk = async (req, res) => {
  try {
    const { bullets, jobRole } = req.body;

    // Strict batch validation (A22): Bounds bullet count to max 25 and checks length
    const validation = validateArrayOfStrings(bullets, 1, 25, 5, 1000);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    if (jobRole !== undefined && typeof jobRole !== 'string') {
      return res.status(400).json({ success: false, message: "jobRole must be a string." });
    }

    const data = await enhanceBulkBullets(bullets, jobRole);
    return res.status(200).json({
      success: true,
      data,
      count: data.length
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error("Bulk bullet enhance error:", error.message);
    }
    return res.status(500).json({ success: false, message: error.message || "Failed to enhance bulk bullets." });
  }
};

module.exports = { enhanceSingle, enhanceBulk };
