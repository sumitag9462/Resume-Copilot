// ─────────────────────────────────────────────────
// services/bulletEnhancerService.js
// Uses Gemini API — same pattern as your existing services
// Drop into your existing services/ folder
// ─────────────────────────────────────────────────

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const model = genAI.getGenerativeModel({ model: geminiModel });

const SYSTEM_PROMPT = `You are a professional resume writer. Your job is to rewrite weak resume bullet points into strong, metric-driven, STAR-format bullets.

RULES — follow every single one:
1. Start with a strong past-tense action verb (Engineered, Led, Optimized, Built, etc.)
2. Include a quantified impact wherever possible (%, $, time saved, users, etc.)
3. Keep it under 20 words
4. Never start with "I"
5. Do NOT invent specific company names or fake numbers — if no metric is given, use approximate language like "~40%" or "team of 5"
6. Return ONLY a JSON object — no markdown, no explanation, no backticks

JSON FORMAT (return exactly this structure):
{
  "original": "<the original bullet>",
  "enhanced": "<your rewritten bullet>",
  "explanation": "<1 sentence: what you changed and why>",
  "actionVerb": "<the action verb you chose>",
  "alternates": ["<alternate version 1>", "<alternate version 2>"]
}`;

const enhanceBullet = async (bulletText, jobRole = "") => {
  if (!bulletText || bulletText.trim().length < 5) {
    throw new Error("Please provide a bullet point to enhance.");
  }

  const userPrompt = `
Target job role (optional context): ${jobRole || "Software Engineer"}

Bullet point to enhance:
"${bulletText.trim()}"

Rewrite this bullet point following all rules. Return ONLY the JSON object.`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: SYSTEM_PROMPT + "\n\n" + userPrompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 400 },
  });

  const raw = result.response.text().trim();

  // Strip markdown code blocks if AI adds them (safety net)
  const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("AI returned invalid JSON. Try again.");
  }

  // Validate structure
  if (!parsed.enhanced || !parsed.explanation) {
    throw new Error("AI response missing required fields.");
  }

  return parsed;
};

// Enhance multiple bullets at once (for batch processing)
const enhanceBulkBullets = async (bullets = [], jobRole = "") => {
  if (!Array.isArray(bullets) || bullets.length === 0) {
    throw new Error("Provide an array of bullet points.");
  }
  if (bullets.length > 10) {
    throw new Error("Maximum 10 bullets at a time.");
  }

  const BULK_PROMPT = `You are a professional resume writer.

Rewrite each bullet point into a strong, quantified, action-driven resume bullet.
Rules: strong past-tense verb, quantified impact where possible, under 20 words, no "I".
If no metrics given, use approximate language like "~30%" or "team of 4".

Target role: ${jobRole || "Software Engineer"}

Bullets:
${bullets.map((b, i) => `${i + 1}. "${b}"`).join("\n")}

Return ONLY a JSON array — no markdown, no explanation:
[
  { "original": "...", "enhanced": "...", "explanation": "..." },
  ...
]`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: BULK_PROMPT }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
  });

  const raw = result.response.text().trim();
  const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("AI returned invalid JSON for bulk enhancement.");
  }
};

module.exports = { enhanceBullet, enhanceBulkBullets };