// ─────────────────────────────────────────────────
// controllers/bulletEnhancerController.js
// ─────────────────────────────────────────────────

const { enhanceBullet, enhanceBulkBullets } = require("../services/bulletEnhancerService");

// POST /api/bullets/enhance
// Body: { bullet: "helped with login page", jobRole: "Frontend Developer" }
const enhanceSingle = async (req, res) => {
  try {
    const { bullet, jobRole } = req.body;

    if (!bullet || bullet.trim().length < 5) {
      return res.status(400).json({ success: false, message: "Please provide a bullet point." });
    }

    const data = await enhanceBullet(bullet, jobRole);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Bullet enhance error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/bullets/enhance-bulk
// Body: { bullets: ["bullet1", "bullet2"], jobRole: "..." }
const enhanceBulk = async (req, res) => {
  try {
    const { bullets, jobRole } = req.body;

    if (!Array.isArray(bullets) || bullets.length === 0) {
      return res.status(400).json({ success: false, message: "Provide an array of bullet points." });
    }

    const data = await enhanceBulkBullets(bullets, jobRole);
    return res.status(200).json({ success: true, data, count: data.length });
  } catch (error) {
    console.error("Bulk bullet enhance error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { enhanceSingle, enhanceBulk };


// ─────────────────────────────────────────────────
// routes/bulletEnhancerRoutes.js
// ─────────────────────────────────────────────────
// Save the part below in a SEPARATE file: routes/bulletEnhancerRoutes.js
//
// Then in app.js add:
//   const bulletRoutes = require('./routes/bulletEnhancerRoutes');
//   app.use('/api/bullets', bulletRoutes);
// ─────────────────────────────────────────────────

/*
const express = require("express");
const router = express.Router();
const { enhanceSingle, enhanceBulk } = require("../controllers/bulletEnhancerController");
const { protect } = require("../middleware/authMiddleware");

router.post("/enhance", protect, enhanceSingle);
router.post("/enhance-bulk", protect, enhanceBulk);

module.exports = router;
*/