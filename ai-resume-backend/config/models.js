// config/models.js — CENTRAL MODEL CONFIGURATION
//
// Defines metadata, parameters, and API identifiers for supported Gemini models.
// Adding a new model is as easy as adding a new entry here.

const MODELS = {
  "gemini-2.5-flash-lite": {
    apiName: "gemini-2.5-flash-lite",
    displayName: "Gemini 2.5 Flash Lite",
    isAlias: false,
    speed: "Fast",
    cost: "Cheap",
    description: "Lightweight, highly optimized for speed and cost-effective operations."
  },
  "gemini-2.5-flash": {
    apiName: "gemini-2.5-flash",
    displayName: "Gemini 2.5 Flash",
    isAlias: false,
    speed: "Fast",
    cost: "Balanced",
    description: "Recommended default model with balanced speed, reasoning, and accuracy."
  },
  "gemini-flash-latest": {
    apiName: "gemini-2.5-flash",
    displayName: "Gemini Flash Latest (Alias)",
    isAlias: true,
    targetModel: "gemini-2.5-flash",
    speed: "Fast",
    cost: "Balanced",
    description: "Compatibility alias mapped to Gemini 2.5 Flash."
  },
  "gemini-pro": {
    apiName: "gemini-2.5-flash",
    displayName: "Gemini Pro (Alias)",
    isAlias: true,
    targetModel: "gemini-2.5-flash",
    speed: "Fast",
    cost: "Balanced",
    description: "Compatibility alias routed to Gemini 2.5 Flash under standard credentials."
  }
};

module.exports = {
  MODELS,
  DEFAULT_MODEL: "gemini-2.5-flash",
  ALL_MODELS: Object.keys(MODELS),
  // Distinct physical models for parallel comparison (A06: never compare duplicate underlying models)
  DISTINCT_ARENA_MODELS: ["gemini-2.5-flash-lite", "gemini-2.5-flash"]
};
