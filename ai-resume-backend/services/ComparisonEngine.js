// services/ComparisonEngine.js — MULTI-MODEL ARENA COMPARISON ENGINE
//
// Handles parallel execution of Gemini models, maps them, captures timing/tokens,
// and invokes the scoring engine to evaluate results.

const { MODELS } = require("../config/models");
const { FEATURES } = require("../config/features");
const { getRouteModel } = require("./ModelRouter");
const { evaluateArenaRun } = require("./ScoringEngine");
const { getGenAIInstance } = require("./KeyManager");

/**
 * Executes a prompt on a single Gemini model with timing and token usage.
 */
const runModelQuery = async (feature, inputs, modelKey, prompt) => {
  const modelConfig = MODELS[modelKey];
  if (!modelConfig) {
    return {
      model: modelKey,
      output: null,
      executionTime: 0,
      error: `Model configuration for '${modelKey}' not found`,
      tokenUsage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
    };
  }

  const apiModelName = modelConfig.apiName;
  const startTime = Date.now();

  try {
    // ⚠️ SPECIFIC INSTANTIATION PATTERN TO PREVENT 256 TOKEN LIMIT BUG
    // Configure responseMimeType and maxOutputTokens inside getGenerativeModel
    let modelInstance = getGenAIInstance().getGenerativeModel({
      model: apiModelName,
      generationConfig: {
        temperature: 0.1, // low temperature for consistent schema adherence
        maxOutputTokens: 8192 // Full model context output
      }
    });

    let result = null;
    let attempt = 1;
    const maxRetries = 3;
    let delayMs = 2000;

    while (attempt <= maxRetries) {
      try {
        console.log(`[Arena Engine] Querying ${modelKey} (${apiModelName}) for ${feature} (attempt ${attempt}/${maxRetries})...`);
        result = await modelInstance.generateContent(prompt);
        break; // Success
      } catch (err) {
        const isTemporary = 
          err.message?.includes("503") || 
          err.message?.includes("Service Unavailable") || 
          err.message?.includes("429") || 
          err.message?.includes("Quota exceeded") ||
          err.message?.includes("Resource exhausted") ||
          err.message?.includes("overloaded");

        if (isTemporary && attempt < maxRetries) {
          // If the error specifically mentions a long wait time (e.g. 429 Quota Exceeded) or 503 High Demand,
          // fallback to the lighter model immediately to preserve UX rather than failing.
          if (err.message?.includes("429") || err.message?.includes("Quota exceeded") || err.message?.includes("503") || err.message?.includes("high demand")) {
             console.warn(`[Arena Engine] Model ${modelKey} overloaded. Switching to fallback model gemini-2.5-flash-lite.`);
             modelInstance = getGenAIInstance().getGenerativeModel({
               model: "gemini-2.5-flash-lite",
               generationConfig: { temperature: 0.1, maxOutputTokens: 8192 }
             });
             // We don't delay, we just instantly retry on the fallback model
             attempt++;
          } else {
            console.warn(`[Arena Engine] Temporary error on ${modelKey}: ${err.message}. Retrying in ${delayMs}ms...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            delayMs *= 2; // Exponential backoff
            attempt++;
          }
        } else {
          throw err;
        }
      }
    }

    // Log finish reason if not STOP
    const candidate = result.response.candidates?.[0];
    if (candidate && candidate.finishReason !== "STOP") {
      console.warn(`[Arena Engine] Warning: Model ${modelKey} finished with reason: ${candidate.finishReason}`);
    }

    const responseText = result.response.text();
    let parsedJSON = null;

    try {
      const { extractAndCleanJSON } = require('./aiHelper');
      const cleanedText = extractAndCleanJSON(responseText);
      parsedJSON = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error(`[Arena Engine] JSON parsing failed for model ${modelKey}. Raw:`, responseText);
      throw new Error("Model returned invalid JSON formatting.");
    }

    const duration = Date.now() - startTime;
    const usage = result.response.usageMetadata || {};

    return {
      model: modelKey,
      output: parsedJSON,
      executionTime: duration,
      error: null,
      tokenUsage: {
        promptTokens: usage.promptTokenCount || 0,
        completionTokens: usage.candidatesTokenCount || 0,
        totalTokens: usage.totalTokenCount || 0
      }
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Arena Engine] Error running model ${modelKey}:`, error.message);
    
    let errorMessage = error.message || "Failed execution";
    if (errorMessage.includes("429") || errorMessage.includes("Quota") || errorMessage.includes("Too Many Requests")) {
      errorMessage = "We are currently experiencing high traffic. Please wait a few moments and try again.";
    } else if (errorMessage.includes("503") || errorMessage.includes("Service Unavailable")) {
      errorMessage = "The AI service is temporarily down. Please try again later.";
    }

    return {
      model: modelKey,
      output: null,
      executionTime: duration,
      error: errorMessage,
      tokenUsage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
    };
  }
};

/**
 * Core driver that executes single or multi-model runs.
 * 
 * @param {string} feature Key identifier for the task
 * @param {object} inputs Parameter fields for prompt builder
 * @param {string} selectedModel Model key requested (or 'auto')
 * @param {boolean} compareMode Whether to execute multiple models in parallel
 * @returns {object} Finished arena record (results list, winner key, bestResults tags)
 */
const executeArenaRun = async (feature, inputs, selectedModel, compareMode) => {
  const featConfig = FEATURES[feature];
  if (!featConfig) {
    throw new Error(`Unsupported feature key: '${feature}'`);
  }

  // Generate prompt once using input details
  const prompt = featConfig.buildPrompt(inputs);

  let results = [];

  if (!compareMode) {
    // Single Model Mode
    const targetModel = getRouteModel(feature, selectedModel);
    const resultObj = await runModelQuery(feature, inputs, targetModel, prompt);
    results = [resultObj];
  } else {
    // Parallel Comparison Mode (Compare Lite, Flash, Pro)
    const modelsToRun = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-pro"];
    
    const parallelPromises = modelsToRun.map(modelKey => 
      runModelQuery(feature, inputs, modelKey, prompt)
    );
    
    results = await Promise.all(parallelPromises);
  }

  // Grade the runs and determine the overall winners
  const evaluation = evaluateArenaRun(feature, results);

  return {
    results: evaluation.results,
    winner: evaluation.winner,
    bestResults: evaluation.bestResults
  };
};

module.exports = {
  executeArenaRun
};
