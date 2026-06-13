// ─────────────────────────────────────────────────
// routes/bulletEnhancerRoutes.js
// Add to app.js:
//   const bulletRoutes = require('./routes/bulletEnhancerRoutes');
//   app.use('/api/bullets', bulletRoutes);
// ─────────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const { enhanceSingle, enhanceBulk } = require("../controllers/bulletEnhancerController");
const { protect } = require("../middleware/authMiddleware");

router.post("/enhance", protect, enhanceSingle);           // single bullet
router.post("/enhance-bulk", protect, enhanceBulk);        // up to 10 bullets

module.exports = router;