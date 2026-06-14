const { getGenAIInstance } = require("./KeyManager");

/**
 * Fast, lightweight AI validation to block garbage inputs, jokes, or profanity.
 */
const validateInputs = async (inputs) => {
  // If no specific text inputs to validate, just pass it through
  if (!inputs || Object.keys(inputs).length === 0) {
    return { isValid: true, reason: "" };
  }

  try {
    const model = getGenAIInstance().getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      generationConfig: {
        temperature: 0.1,
      }
    });

    // Strip out large fields like resumeText so the validator is incredibly fast and cheap
    const validationTargets = { ...inputs };
    delete validationTargets.resumeText;
    delete validationTargets.resumeTextA;
    delete validationTargets.resumeTextB;
    delete validationTargets.resumeId;

    // If only IDs or internal fields remain, skip validation
    if (Object.keys(validationTargets).length === 0) {
      return { isValid: true, reason: "" };
    }

    const prompt = `You are a strict input validator for an AI career tool. 
Evaluate the following user inputs to ensure they are professionally relevant, make logical sense, and are free of gibberish, profanity, or jokes (e.g. "Batman", "asdfgh").

User Inputs:
${JSON.stringify(validationTargets, null, 2)}

If the inputs contain valid career terms, company names, or job descriptions, return isValid: true.
If the inputs are clearly fake, a joke, random characters, or inappropriate, return isValid: false and explain why.

Return ONLY a valid JSON object matching this schema:
{
  "isValid": boolean,
  "reason": "String explaining why it was rejected, or empty if valid."
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const { extractAndCleanJSON } = require('./aiHelper');
    const cleanedText = extractAndCleanJSON(responseText);
    const parsed = JSON.parse(cleanedText);
    
    return {
      isValid: parsed.isValid === true,
      reason: parsed.reason || "Invalid input detected."
    };
  } catch (err) {
    console.error("[ValidationEngine] Error during validation:", err.message);
    // On error, fail open to prevent blocking legitimate users due to an AI API outage
    return { isValid: true, reason: "" };
  }
};

module.exports = { validateInputs };
