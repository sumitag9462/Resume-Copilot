require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
        responseMimeType: "application/json"
      }
    });

    const prompt = `Return a JSON object with success: true and message: "Hello".`;
    const result = await model.generateContent(prompt);
    console.log("Finish Reason:", result.response.candidates[0].finishReason);
    console.log("Response:", result.response.text());
  } catch(e) {
    console.error(e);
  }
}
test();
