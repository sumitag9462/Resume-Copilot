// controllers/arenaController.js — UNIFIED ARENA CONTROLLER
//
// Manages the pipeline of fetching resume text, caching checks, model execution,
// scoring engine ratings, and DB logging for all 16 AI features.

const ArenaHistory = require("../models/ArenaHistory");
const Resume = require("../models/Resume");
const { executeArenaRun } = require("../services/ComparisonEngine");
const { validateInputs } = require("../services/ValidationEngine");

/**
 * Helper to retrieve a resume and assert user ownership.
 */
const resolveResumeText = async (resumeId, userId) => {
  const resume = await Resume.findById(resumeId);
  if (!resume) {
    throw new Error("Selected resume not found");
  }
  if (resume.user.toString() !== userId.toString()) {
    throw new Error("Access denied: you do not own this resume");
  }
  return resume.extractedText;
};

/**
 * Handles running an Arena task (single model or multi-model comparison).
 * @route POST /api/arena/run
 */
const runArena = async (req, res, next) => {
  try {
    const { feature, inputs = {}, model = "auto", compareMode = false, forceRefresh = false } = req.body;

    if (!feature) {
      return res.status(400).json({ success: false, message: "Parameter 'feature' is required" });
    }

    // ── CACHE CHECK ──────────────────────────────────────────
    // Search history logs for identical executions in the last 24 hours
    // We check this BEFORE injecting massive resume texts to keep the comparison clean.
    if (!forceRefresh) {
      const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const candidates = await ArenaHistory.find({
        userId: req.user._id,
        feature,
        selectedModel: model,
        compareMode,
        createdAt: { $gte: last24h }
      }).sort({ createdAt: -1 });

      // Robust deep equality check for inputs (ignores object key order)
      const deepEqual = (obj1, obj2) => {
        if (obj1 === obj2) return true;
        if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 == null || obj2 == null) return false;
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        if (keys1.length !== keys2.length) return false;
        for (let key of keys1) {
          if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
        }
        return true;
      };

      const match = candidates.find(c => deepEqual(c.input, inputs));

      if (match) {
        console.log(`[Arena Controller] Cache HIT for feature '${feature}'`);
        return res.status(200).json({
          success: true,
          fromCache: true,
          arenaRun: match
        });
      }
    }

    // Clone inputs for execution so we don't mutate the version saved to DB
    const executionInputs = { ...inputs };

    // Resolve resume references dynamically to fetch their plain text
    if (executionInputs.resumeId) {
      try {
        executionInputs.resumeText = await resolveResumeText(executionInputs.resumeId, req.user._id);
      } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
    }

    if (executionInputs.resumeIdA) {
      try {
        executionInputs.resumeTextA = await resolveResumeText(executionInputs.resumeIdA, req.user._id);
      } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
    }

    if (executionInputs.resumeIdB) {
      try {
        executionInputs.resumeTextB = await resolveResumeText(executionInputs.resumeIdB, req.user._id);
      } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
    }

    // ── AI INPUT VALIDATION ──────────────────────────────────
    console.log(`[Arena Controller] Validating inputs for feature '${feature}'...`);
    const validation = await validateInputs(inputs);
    if (!validation.isValid) {
      console.warn(`[ValidationEngine] Rejected input: ${validation.reason}`);
      return res.status(200).json({ 
        success: true, 
        fromCache: false,
        arenaRun: {
          feature,
          selectedModel: "AI Validator",
          compareMode: false,
          results: [{
            model: "AI Validator",
            error: validation.reason,
            executionTime: 0,
            tokenUsage: {}
          }],
          winner: "AI Validator",
          bestResults: {}
        }
      });
    }

    // ── EXECUTE MODELS ───────────────────────────────────────
    console.log(`[Arena Controller] Cache MISS. Running feature '${feature}'...`);
    const runResult = await executeArenaRun(feature, executionInputs, model, compareMode);

    // ── SAVE TO DATABASE ─────────────────────────────────────
    const historyRecord = await ArenaHistory.create({
      userId: req.user._id,
      feature,
      input: inputs, // Save pristine inputs (no bloated text)
      selectedModel: model,
      compareMode,
      results: runResult.results,
      winner: runResult.winner,
      bestResults: runResult.bestResults
    });

    return res.status(201).json({
      success: true,
      fromCache: false,
      arenaRun: historyRecord
    });

  } catch (error) {
    console.error("[Arena Controller] Run error:", error.message);
    next(error);
  }
};

/**
 * Fetches user's past Arena comparison run history.
 * @route GET /api/arena/history
 */
const getArenaHistory = async (req, res, next) => {
  try {
    const { feature } = req.query;
    const filter = { userId: req.user._id };

    if (feature) {
      filter.feature = feature;
    }

    const history = await ArenaHistory.find(filter)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a specific Arena history record.
 * @route DELETE /api/arena/history/:id
 */
const deleteArenaHistory = async (req, res, next) => {
  try {
    const record = await ArenaHistory.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Arena record not found" });
    }

    if (record.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized deletion attempt" });
    }

    await record.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Arena record deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  runArena,
  getArenaHistory,
  deleteArenaHistory
};
