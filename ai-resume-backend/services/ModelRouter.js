// services/ModelRouter.js — TASK ROUTER FOR GEMINI MODELS
//
// Determines the most appropriate model to use based on the task description or user choice.

const { FEATURES } = require("../config/features");
const { DEFAULT_MODEL } = require("../config/models");

/**
 * Resolves the correct model API name to route the request to.
 * If a specific model is requested, it directly uses that.
 * If 'auto' is requested, it maps based on features config.
 * 
 * @param {string} feature Feature key (e.g. 'ats_analysis', 'resume_boost')
 * @param {string} selectedModel Selected model ('auto' or model name)
 * @returns {string} Target model key
 */
const getRouteModel = (feature, selectedModel) => {
  // If user selected a specific model (not 'auto'), respect that choice
  if (selectedModel && selectedModel !== "auto") {
    return selectedModel;
  }

  // Otherwise, use our task-based routing logic from features config
  const featConfig = FEATURES[feature];
  if (featConfig && featConfig.autoModel) {
    return featConfig.autoModel;
  }

  // Fallback to default model
  return DEFAULT_MODEL;
};

module.exports = {
  getRouteModel
};
