const { generateContentWithFallback } = require("./aiHelper");
const { isSafeString } = require("../utils/validationHelper");

/**
 * Enhances a single resume bullet point using Gemini AI.
 *
 * @param {string} bulletText The raw bullet text
 * @param {string} jobRole The target job role
 * @returns {Promise<object>} The enhanced bullet structure
 */
const enhanceBullet = async (bulletText, jobRole = "") => {
  if (!isSafeString(bulletText, 5, 1000)) {
    throw new Error("Please provide a valid bullet point between 5 and 1000 characters.");
  }

  const safeJobRole = typeof jobRole === 'string' ? jobRole.trim().slice(0, 100) : "Software Engineer";

  const prompt = `You are an expert resume writer.

Rewrite the resume bullet.

Rules:
* ATS friendly
* Strong action verb
* Quantify impact if possible
* Add technical keywords
* Under 30 words
* Target role: ${safeJobRole || "Software Engineer"}

Bullet:
"${bulletText.trim().replace(/"/g, '\\"')}"

Return ONLY a JSON object with this exact structure (no markdown, no backticks, no explanation):
{
  "success": true,
  "original": "${bulletText.trim().replace(/"/g, '\\"')}",
  "enhanced": "<the rewritten bullet>"
}`;

  const result = await generateContentWithFallback(prompt, { maxOutputTokens: 400 });

  const raw = result.response.text().trim();
  const match = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  const cleaned = match ? match[0] : raw.trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("AI returned invalid JSON. Try again.");
  }

  if (!parsed.enhanced) {
    throw new Error("AI response missing required fields.");
  }

  return parsed;
};

/**
 * Enhances multiple bullets concurrently with graceful per-item failure handling (A22).
 * Preserves user input order and returns explicit partial results.
 *
 * @param {Array<string>} bullets Array of bullet strings (max 25)
 * @param {string} jobRole Target job role
 * @returns {Promise<Array<object>>} Array of per-bullet results
 */
const enhanceBulkBullets = async (bullets, jobRole = "") => {
  if (!Array.isArray(bullets) || bullets.length === 0) {
    throw new Error("Provide an array of bullet points.");
  }

  const results = await Promise.allSettled(
    bullets.map(b => enhanceBullet(b, jobRole))
  );

  return results.map((res, idx) => {
    if (res.status === 'fulfilled') {
      return {
        success: true,
        original: bullets[idx],
        enhanced: res.value.enhanced,
        status: 'enhanced'
      };
    } else {
      return {
        success: false,
        original: bullets[idx],
        enhanced: null,
        error: res.reason?.message || 'Failed to enhance bullet',
        status: 'failed'
      };
    }
  });
};

module.exports = { enhanceBullet, enhanceBulkBullets };
