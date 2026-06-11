// config/models.js — CENTRAL MODEL CONFIGURATION
//
// Defines metadata, parameters, and API identifiers for supported Gemini models.
// Adding a new model is as easy as adding a new entry here.

const MODELS = {
  "gemini-2.5-flash-lite": {
    apiName: "gemini-2.5-flash-lite",
    displayName: "Gemini 2.5 Flash Lite",
    accuracy: 4, // out of 5
    speed: "Fast",
    cost: "Cheap",
    reasoning: "Good",
    practicality: "Good",
    atsQuality: "Good",
    recruiterQuality: "Good",
    confidence: 80, // percentage
    description: "Lightweight, highly optimized for speed and cost-effective operations."
  },
  "gemini-2.5-flash": {
    apiName: "gemini-2.5-flash",
    displayName: "Gemini 2.5 Flash",
    accuracy: 5,
    speed: "Very Fast",
    cost: "Balanced",
    reasoning: "Very Good",
    practicality: "Balanced",
    atsQuality: "Very Good",
    recruiterQuality: "Very Good",
    confidence: 90,
    description: "Our recommended default model. Balanced speed, reasoning, and accuracy."
  },
  "gemini-flash-latest": {
    apiName: "gemini-2.5-flash-lite", // Maps to working 2.5 flash lite
    displayName: "Gemini Flash Lite Latest",
    accuracy: 4.5,
    speed: "Fast",
    cost: "Balanced",
    reasoning: "Good",
    practicality: "Balanced",
    atsQuality: "Good",
    recruiterQuality: "Good",
    confidence: 85,
    description: "Alternative flash model offering stable performance."
  },
  "gemini-pro": {
    apiName: "gemini-2.5-flash", // Maps to Gemini 2.5 Flash for speed, reliability, and free tier compatibility
    displayName: "Gemini Pro (via Flash)",
    accuracy: 5,
    speed: "Very Fast",
    cost: "Premium",
    reasoning: "Very Good",
    practicality: "Deep Analysis",
    atsQuality: "Excellent",
    recruiterQuality: "Excellent",
    confidence: 90,
    description: "Mapped to Gemini 2.5 Flash (free tier compatible). Same speed and quality as Flash."
  }
};

module.exports = {
  MODELS,
  DEFAULT_MODEL: "gemini-2.5-flash",
  ALL_MODELS: Object.keys(MODELS)
};
