const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates content using Gemini API with built-in retries and fallback models.
 * Handles 503 Service Unavailable, 429 Rate Limit, and overloaded states.
 * 
 * @param {string} prompt The full prompt text to send to the AI
 * @param {object} generationConfig Optional configuration overrides
 * @returns {Promise<object>} The raw result response from the generative model
 */
const generateContentWithFallback = async (prompt, generationConfig = {}) => {
  const primaryModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const fallbacks = [
    "gemini-3.5-flash",
    "gemini-2.0-flash",
    "gemini-flash-latest",
    "gemini-2.5-flash-lite"
  ];
  
  // Build priority order of models to try
  const modelOrder = [...new Set([primaryModel, ...fallbacks])];
  
  let lastError = null;

  for (const modelName of modelOrder) {
    let delayMs = 1500;
    const maxRetries = 2;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[AI Helper] Querying ${modelName} (attempt ${attempt}/${maxRetries})...`);
        
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192, // Use model's full capacity
            ...generationConfig
          }
        });

        const result = await model.generateContent(prompt);
        
        const candidate = result.response.candidates?.[0];
        if (candidate && candidate.finishReason === "MAX_TOKENS") {
          throw new Error("Response truncated due to token limit");
        }
        
        // Return if successful
        return result;
      } catch (error) {
        lastError = error;
        
        // Detect temporary failures
        const isTemporary = 
          error.message?.includes("503") || 
          error.message?.includes("Service Unavailable") || 
          error.message?.includes("429") || 
          error.message?.includes("Quota exceeded") ||
          error.message?.includes("Resource exhausted") ||
          error.message?.includes("overloaded");

        if (isTemporary && attempt < maxRetries) {
          console.warn(`[AI Helper] Temporary error on model ${modelName}: ${error.message}. Retrying in ${delayMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          delayMs *= 2; // Exponential backoff
          continue;
        }

        // If not a temporary error or exhausted retries for this model, try next model in loop
        console.warn(`[AI Helper] Model ${modelName} generation failed or quota exceeded: ${error.message}. Trying fallback...`);
        break;
      }
    }
  }

  throw new Error(`AI Service is currently overloaded. Last error: ${lastError?.message || "Unknown error"}. Please try again in a few moments.`);
};

module.exports = {
  generateContentWithFallback
};
