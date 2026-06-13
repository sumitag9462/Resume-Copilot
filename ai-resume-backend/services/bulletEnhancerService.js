const { generateContentWithFallback } = require("./aiHelper");

const enhanceBullet = async (bulletText, jobRole = "") => {
  if (!bulletText || bulletText.trim().length < 5) {
    throw new Error("Please provide a bullet point to enhance.");
  }

  const prompt = `You are an expert resume writer.

Rewrite the resume bullet.

Rules:
* ATS friendly
* Strong action verb
* Quantify impact if possible
* Add technical keywords
* Under 30 words
* Target role: ${jobRole || "Software Engineer"}

Bullet:
"${bulletText.trim()}"

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

module.exports = { enhanceBullet };
