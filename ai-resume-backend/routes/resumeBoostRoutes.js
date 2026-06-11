const express = require("express");
const router = express.Router();
const { enhanceSingle, scanWeakLanguage } = require("../controllers/resumeBoostController");
const { protect } = require("../middleware/authMiddleware");
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: { success: false, message: "Too many requests, please try again later." }
});

router.post("/enhance", protect, apiLimiter, enhanceSingle);
router.post("/scan", protect, apiLimiter, scanWeakLanguage);

module.exports = router;
