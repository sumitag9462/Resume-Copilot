// ============================================================
// services/voiceInterviewService.js — VOICE INTERVIEW AI ENGINE
//
// Core AI service for the voice interview feature.
// Uses Gemini's multi-turn chat API (startChat) for natural
// conversation flow with full context memory.
//
// Three main functions:
//   1. startInterview  — Initialize chat + generate opening
//   2. continueChat    — Send user answer, get next question
//   3. evaluateInterview — Generate final scorecard
//
// Uses the existing KeyManager for API key rotation and
// follows the same retry/fallback pattern as geminiService.js.
// ============================================================

const { getGenAIInstance } = require('./KeyManager');
const { buildInterviewSystemPrompt, buildEvaluationPrompt } = require('./voiceInterviewPrompts');

// --- MODEL PRIORITY LIST ---
const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-2.0-flash-exp'
];

// ── HELPER: Parse JSON from AI response ─────────────────────
const parseJSON = (text) => {
  try {
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    const cleaned = match ? match[0] : text.trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('[voiceInterviewService] Raw AI response that failed to parse:', text);
    throw new Error('AI returned an invalid response. Please try again.');
  }
};

// ── HELPER: Retry logic with model fallback ─────────────────
const withRetry = async (operation, operationName) => {
  const maxRetriesPerModel = 3;

  for (const modelName of GEMINI_MODELS) {
    let attempt = 1;
    let delayMs = 2000;

    while (attempt <= maxRetriesPerModel) {
      try {
        console.log(`[voiceInterviewService] ${operationName}: Attempting ${modelName} (attempt ${attempt}/${maxRetriesPerModel})...`);
        return await operation(modelName);
      } catch (err) {
        const isTemporary =
          err.message?.includes("503") ||
          err.message?.includes("Service Unavailable") ||
          err.message?.includes("overloaded");

        // If it's a strict quota limit, do not spam retries for this model.
        // Break out of the inner loop to instantly fallback to the next model (e.g. flash-lite).
        if (err.message?.includes("429") || err.message?.includes("Quota exceeded") || err.message?.includes("Resource exhausted")) {
           console.error(`[voiceInterviewService] ${operationName}: Strict Quota Limit hit for ${modelName}. Falling back to next model.`);
           break;
        }

        if (isTemporary && attempt < maxRetriesPerModel) {
          console.warn(`[voiceInterviewService] ${operationName}: Temporary error with ${modelName}: ${err.message}. Retrying in ${delayMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          delayMs *= 2;
          attempt++;
        } else {
          console.error(`[voiceInterviewService] ${operationName}: Model ${modelName} failed on attempt ${attempt}. Error: ${err.message}`);
          break;
        }
      }
    }
  }

  throw new Error("Our AI models are currently experiencing high demand. Please wait a moment and try again.");
};


/**
 * Start a new interview session.
 * Creates a Gemini chat with the system prompt and generates the opening message.
 *
 * @param {string} resumeText - Candidate's resume text
 * @param {string} jobDescription - Target job description
 * @param {string} companyName - Company name
 * @param {string} interviewType - e.g. Technical, Behavioral, Recruiter, Hiring Manager
 * @param {string} companyMode - e.g. General, Google, Meta, Amazon
 * @param {string} language - e.g. English, Spanish
 * @returns {{ aiResponse: string, systemPrompt: string }}
 */
const startInterview = async (resumeText, jobDescription, companyName, interviewType, companyMode, language) => {
  const systemPrompt = buildInterviewSystemPrompt(resumeText, jobDescription, companyName, interviewType, companyMode, language);

  const aiResponse = await withRetry(async (modelName) => {
    const genAI = getGenAIInstance();
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt,
      generationConfig: {
        temperature: 0.8,    // Slightly creative for natural conversation
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 500, // Keep responses concise (spoken interview)
      }
    });

    const chat = model.startChat({ history: [] });
    const result = await chat.sendMessage("Begin the interview. Introduce yourself and ask your first question.");
    return result.response.text();
  }, 'startInterview');

  return { aiResponse, systemPrompt };
};


/**
 * Continue an ongoing interview conversation.
 * Reconstructs the chat session from stored history and sends the new user message.
 *
 * @param {Array} chatHistory - Array of { role, content } from database
 * @param {string} systemPrompt - The system instruction (built at session start)
 * @param {string} userMessage - The candidate's latest answer
 * @param {string} resumeText - For system instruction reconstruction
 * @param {string} jobDescription - For system instruction reconstruction
 * @param {string} companyName - For system instruction reconstruction
 * @param {string} interviewType - For system instruction reconstruction
 * @param {string} companyMode - For system instruction reconstruction
 * @param {string} language - For system instruction reconstruction
 * @returns {string} AI's next question/response
 */
const continueChat = async (chatHistory, systemPrompt, userMessage, resumeText, jobDescription, companyName, interviewType, companyMode, language) => {
  // If systemPrompt is not stored, rebuild it
  const instruction = systemPrompt || buildInterviewSystemPrompt(resumeText, jobDescription, companyName, interviewType, companyMode, language);

  const aiResponse = await withRetry(async (modelName) => {
    const genAI = getGenAIInstance();
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: instruction,
      generationConfig: {
        temperature: 0.8,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 500,
      }
    });

    // Convert stored chat history to Gemini SDK format
    const geminiHistory = chatHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    // Gemini API strictly requires multi-turn history to start with a 'user' message
    if (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
      geminiHistory.unshift({
        role: 'user',
        parts: [{ text: 'Begin the interview. Introduce yourself and ask your first question.' }]
      });
    }

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  }, 'continueChat');

  return aiResponse;
};


/**
 * Continue an ongoing interview conversation via Server-Sent Events (Streaming).
 * Reconstructs the chat session and returns an AsyncGenerator of text chunks.
 */
const continueChatStream = async (chatHistory, systemPrompt, userMessage, resumeText, jobDescription, companyName, interviewType, companyMode, language) => {
  const instruction = systemPrompt || buildInterviewSystemPrompt(resumeText, jobDescription, companyName, interviewType, companyMode, language);

  const resultStream = await withRetry(async (modelName) => {
    const genAI = getGenAIInstance();
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: instruction,
      generationConfig: {
        temperature: 0.8,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 500,
      }
    });

    const geminiHistory = chatHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    if (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
      geminiHistory.unshift({
        role: 'user',
        parts: [{ text: 'Begin the interview. Introduce yourself and ask your first question.' }]
      });
    }

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessageStream(userMessage);
    
    // We must return the stream immediately. 
    // If it fails here (e.g. 429), it will throw and withRetry will catch it.
    return result.stream;
  }, 'continueChatStream');

  return resultStream;
};


/**
 * Generate the final evaluation scorecard after the interview ends.
 * Sends the full conversation to Gemini with the evaluation prompt.
 *
 * @param {Array} chatHistory - Complete conversation history
 * @param {string} resumeText - Candidate's resume
 * @param {string} jobDescription - Target JD
 * @param {string} companyName - Company name
 * @returns {Object} Structured evaluation scorecard
 */
const evaluateInterview = async (chatHistory, resumeText, jobDescription, companyName) => {
  const evaluationPrompt = buildEvaluationPrompt(chatHistory, resumeText, jobDescription, companyName);

  const evaluation = await withRetry(async (modelName) => {
    const genAI = getGenAIInstance();
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,  // Low temperature for consistent scoring
        topP: 0.8,
        topK: 20,
        maxOutputTokens: 2000,
      }
    });

    const result = await model.generateContent(evaluationPrompt);
    const text = result.response.text();
    return parseJSON(text);
  }, 'evaluateInterview');

  return evaluation;
};


module.exports = {
  startInterview,
  continueChat,
  continueChatStream,
  evaluateInterview
};
