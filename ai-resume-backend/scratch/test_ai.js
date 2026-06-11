const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function runTest() {
  console.log("--- TEST: Model config + string prompt ---");
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192
    }
  });
  
  const prompt = `You are a career helper. Generate a very long JSON list of 25 items. Each item must have name, age, description (50 words), and a sub-list of 10 keywords. Return ONLY valid JSON.`;
  try {
    const result = await model.generateContent(prompt);
    console.log("Finish reason:", result.response.candidates[0]?.finishReason);
    console.log("Response text length:", result.response.text().length);
    const text = result.response.text();
    // Try to parse JSON to confirm it is valid and complete
    const cleaned = text.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
    JSON.parse(cleaned);
    console.log("JSON is valid and complete!");
  } catch (error) {
    console.error("Error details:", error);
  }
}

runTest();