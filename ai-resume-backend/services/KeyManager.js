const { GoogleGenerativeAI } = require("@google/generative-ai");

let keys = [];
let currentIndex = 0;

const initKeys = () => {
  if (keys.length === 0) {
    const rawKeys = process.env.GEMINI_API_KEY || "";
    // Support comma-separated keys or single key
    keys = rawKeys.split(",").map(k => k.trim()).filter(k => k.length > 0);
    
    if (keys.length === 0) {
      console.error("[KeyManager] Warning: No GEMINI_API_KEY provided in environment!");
    } else {
      console.log(`[KeyManager] Initialized with ${keys.length} API keys for rotation.`);
    }
  }
};

const getNextKey = () => {
  initKeys();
  if (keys.length === 0) return null;
  
  const key = keys[currentIndex];
  currentIndex = (currentIndex + 1) % keys.length;
  return key;
};

const getGenAIInstance = () => {
  const key = getNextKey();
  if (!key) {
    throw new Error("No Gemini API Key available. Please set GEMINI_API_KEY.");
  }
  return new GoogleGenerativeAI(key);
};

module.exports = {
  getNextKey,
  getGenAIInstance
};
