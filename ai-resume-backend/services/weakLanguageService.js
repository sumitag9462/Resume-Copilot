const { generateContentWithFallback } = require("./aiHelper");

const analyzeWeakLanguage = async (resumeText) => {
  if (!resumeText || typeof resumeText !== "string") {
    throw new Error("Resume text is required");
  }

  const prompt = `Analyze this resume text.

Find:
* weak verbs
* vague language
* passive statements
* low impact bullets

Resume Text:
"${resumeText.substring(0, 3000)}"

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "scoreImprovement": <number between 1 and 20>,
  "weakPhrases": [
    {
      "original": "<the exact weak phrase found in the text>",
      "reason": "<short reason, e.g. 'Weak action verb'>",
      "improved": "<suggested improved phrase>"
    }
  ],
  "recommendations": [
    "<general recommendation 1>",
    "<general recommendation 2>"
  ]
}`;

  const result = await generateContentWithFallback(prompt, { temperature: 0.5, maxOutputTokens: 800 });

  const raw = result.response.text().trim();
  const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("AI returned invalid JSON. Try again.");
  }

  if (!parsed.weakPhrases) {
    throw new Error("AI response missing required fields.");
  }

  return parsed;
};

module.exports = { analyzeWeakLanguage };