// routes/arenaRoutes.js — ARENA EXPRESS ROUTES
//
// Defines API endpoints for running model queries, viewing histories, and deleting entries.
// Mounted under /api/arena. All endpoints require user authentication.

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { runArena, getArenaHistory, deleteArenaHistory } = require("../controllers/arenaController");
const rateLimit = require("express-rate-limit");

// Prevent spamming heavy multi-model requests
const arenaRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per window
  message: { success: false, message: "Too many requests to the AI Arena, please try again in a few minutes." }
});

// All routes are private
router.use(protect);

router.post("/run", arenaRateLimiter, runArena);
router.get("/history", getArenaHistory);
router.delete("/history/:id", deleteArenaHistory);

module.exports = router;
