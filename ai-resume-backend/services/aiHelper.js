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
        if (candidate && candidate.finishReason !== "STOP") {
          console.warn(`[AI Helper] Warning: Model ${modelName} finished with reason: ${candidate.finishReason}`);
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

  console.error('[aiHelper] All models failed:', lastError?.message);
  throw new Error(
    "Our AI service is temporarily unavailable. " +
    "Please try again in a moment. We apologize for the inconvenience."
  );
};

/**
 * Extracts JSON from LLM output, stripping markdown formatting
 * and sanitizing any unescaped newlines within JSON strings.
 */
const extractAndCleanJSON = (rawText) => {
  const match = rawText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  let cleaned = match ? match[0] : rawText.trim();
  
  let inString = false;
  let isEscaped = false;
  let fixed = "";
  
  for (let i = 0; i < cleaned.length; i++) {
    let char = cleaned[i];
    
    if (char === '"' && !isEscaped) {
      inString = !inString;
    }
    
    if (char === '\\' && !isEscaped) {
      isEscaped = true;
    } else {
      isEscaped = false;
    }

    if (inString) {
      if (char === '\n') fixed += '\\n';
      else if (char === '\r') fixed += '\\r';
      else if (char === '\t') fixed += '\\t';
      else fixed += char;
    } else {
      fixed += char;
    }
  }
  return fixed;
};

module.exports = {
  generateContentWithFallback,
  extractAndCleanJSON
};
