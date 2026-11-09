// controllers/arenaController.js — UNIFIED ARENA CONTROLLER
//
// Manages the pipeline of fetching resume text, caching checks, model execution,
// scoring engine ratings, and DB logging for all 16 AI features.

const crypto = require("crypto");
const ArenaHistory = require("../models/ArenaHistory");
const Resume = require("../models/Resume");
const { executeArenaRun } = require("../services/ComparisonEngine");
const { validateInputs } = require("../services/ValidationEngine");
const { isSafeString, safeTrim } = require("../utils/validationHelper");

// Active in-flight execution promises for request coalescing / deduplication (A20)
const inFlightRuns = new Map();

/**
 * Deterministic cache key generator (A27)
 */
const computeCacheKey = (feature, inputs, model = "auto", compareMode = false) => {
  const normalizedInputs = {};
  const keys = Object.keys(inputs || {}).sort();
  for (const k of keys) {
    if (k !== 'resumeText' && k !== 'resumeTextA' && k !== 'resumeTextB') {
      normalizedInputs[k] = inputs[k];
    }
  }
  if (inputs.resumeText) {
    normalizedInputs.resumeTextHash = crypto.createHash('sha256').update(inputs.resumeText).digest('hex').substring(0, 16);
  }

  const payload = JSON.stringify({
    schemaVersion: "v2",
    feature,
    model,
    compareMode: Boolean(compareMode),
    inputs: normalizedInputs
  });

  return crypto.createHash("sha256").update(payload).digest("hex");
};

/**
 * Helper to retrieve a resume and assert user ownership.
 */
const resolveResumeText = async (resumeId, userId) => {
  const resume = await Resume.findById(resumeId);
  if (!resume) {
    const error = new Error("Selected resume not found");
    error.statusCode = 404;
    throw error;
  }
  if (resume.user.toString() !== userId.toString()) {
    const error = new Error("Access denied: you do not own this resume");
    error.statusCode = 403;
    throw error;
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

    if (!isSafeString(feature, 2, 60)) {
      return res.status(400).json({ success: false, message: "Parameter 'feature' must be a valid non-empty string." });
    }

    if (!inputs || typeof inputs !== 'object' || Array.isArray(inputs)) {
      return res.status(400).json({ success: false, message: "Parameter 'inputs' must be an object." });
    }

    // Clone inputs for execution so we don't mutate the version saved to DB
    const executionInputs = { ...inputs };

    // Resolve resume references dynamically and verify ownership BEFORE cache check (A08)
    if (executionInputs.resumeId) {
      if (typeof executionInputs.resumeId !== 'string') {
        return res.status(400).json({ success: false, message: "Invalid resumeId format." });
      }
      try {
        executionInputs.resumeText = await resolveResumeText(executionInputs.resumeId, req.user._id);
      } catch (err) {
        return res.status(err.statusCode || 400).json({ success: false, message: err.message });
      }
    }

    if (executionInputs.resumeIdA) {
      if (typeof executionInputs.resumeIdA !== 'string') {
        return res.status(400).json({ success: false, message: "Invalid resumeIdA format." });
      }
      try {
        executionInputs.resumeTextA = await resolveResumeText(executionInputs.resumeIdA, req.user._id);
      } catch (err) {
        return res.status(err.statusCode || 400).json({ success: false, message: err.message });
      }
    }

    if (executionInputs.resumeIdB) {
      if (typeof executionInputs.resumeIdB !== 'string') {
        return res.status(400).json({ success: false, message: "Invalid resumeIdB format." });
      }
      try {
        executionInputs.resumeTextB = await resolveResumeText(executionInputs.resumeIdB, req.user._id);
      } catch (err) {
        return res.status(err.statusCode || 400).json({ success: false, message: err.message });
      }
    }

    // ── CACHE CHECK (A27: Fast indexed lookup via deterministic cacheKey) ──
    const cacheKey = computeCacheKey(feature, executionInputs, model, compareMode);

    if (!forceRefresh) {
      const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const match = await ArenaHistory.findOne({
        userId: req.user._id,
        cacheKey,
        createdAt: { $gte: last24h }
      }).sort({ createdAt: -1 });

      if (match && !match.results.every(r => r.error)) {
        return res.status(200).json({
          success: true,
          fromCache: true,
          arenaRun: match
        });
      }
    }

    // ── AI INPUT VALIDATION (A21: Return 400 if input rejected, never false 200) ──
    const validation = await validateInputs(executionInputs);
    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false, 
        message: validation.reason || "Input validation failed. Please review your submission."
      });
    }

    // ── IN-FLIGHT REQUEST COALESCING (A20: Atomic coalescing for simultaneous requests) ──
    const inFlightKey = `${req.user._id}:${cacheKey}`;
    if (inFlightRuns.has(inFlightKey)) {
      try {
        const coalesced = await inFlightRuns.get(inFlightKey);
        return res.status(200).json({
          success: true,
          fromCache: false,
          coalesced: true,
          partial: coalesced.isPartial,
          arenaRun: coalesced.historyRecord
        });
      } catch (inFlightErr) {
        if (inFlightErr.statusCode === 502) {
          return res.status(502).json({
            success: false,
            message: inFlightErr.message,
            arenaRun: {
              feature,
              selectedModel: model,
              compareMode,
              results: inFlightErr.results || [],
              winner: null,
              bestResults: {}
            }
          });
        }
        throw inFlightErr;
      }
    }

    // ── EXECUTE MODELS WITH IN-FLIGHT REGISTRATION ──
    const runPromise = (async () => {
      const runResult = await executeArenaRun(feature, executionInputs, model, compareMode);
      const hasSuccessfulResult = runResult.results.some(r => !r.error);

      if (!hasSuccessfulResult) {
        const errorMsg = runResult.results.map(r => r.error).filter(Boolean).join("; ") || "All models failed to generate valid results";
        const err = new Error(errorMsg);
        err.statusCode = 502;
        err.results = runResult.results;
        throw err;
      }

      const historyRecord = await ArenaHistory.create({
        userId: req.user._id,
        feature,
        input: inputs, // Save pristine inputs
        cacheKey,
        selectedModel: model,
        compareMode,
        results: runResult.results,
        winner: runResult.winner,
        bestResults: runResult.bestResults
      });

      const isPartial = compareMode && runResult.results.some(r => r.error);
      return { historyRecord, isPartial };
    })();

    inFlightRuns.set(inFlightKey, runPromise);
    const safetyTimer = setTimeout(() => {
      inFlightRuns.delete(inFlightKey);
    }, 60000);

    try {
      const { historyRecord, isPartial } = await runPromise;
      return res.status(201).json({
        success: true,
        fromCache: false,
        partial: isPartial,
        arenaRun: historyRecord
      });
    } catch (runErr) {
      if (runErr.statusCode === 502) {
        return res.status(502).json({
          success: false,
          message: runErr.message,
          arenaRun: {
            feature,
            selectedModel: model,
            compareMode,
            results: runErr.results || [],
            winner: null,
            bestResults: {}
          }
        });
      }
      throw runErr;
    } finally {
      clearTimeout(safetyTimer);
      inFlightRuns.delete(inFlightKey);
    }

  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error("[Arena Controller] Run error:", error.message);
    }
    next(error);
  }
};

/**
 * Fetches user's past Arena comparison run history with bounded pagination & projection (A28).
 * @route GET /api/arena/history
 */
const getArenaHistory = async (req, res, next) => {
  try {
    const { feature } = req.query;
    const filter = { userId: req.user._id };

    if (feature) {
      filter.feature = feature;
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const total = await ArenaHistory.countDocuments(filter);
    const history = await ArenaHistory.find(filter)
      .select('-input.resumeText -input.resumeTextA -input.resumeTextB')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: history.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
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
