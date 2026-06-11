const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Resume = require("../models/Resume");
const { rebuildResumeService } = require("../services/resumeRebuildService");
const { generateContentWithFallback } = require("../services/aiHelper");

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    const resume = await Resume.findOne().sort({ createdAt: -1 });
    if (!resume) {
      console.error("No resume found in DB to test with.");
      process.exit(1);
    }

    console.log(`Testing with resume: ${resume.originalName} (${resume.extractedText.length} chars)`);

    // Let's run a manual query to inspect response candidate metadata directly
    const prompt = `You are an ATS Resume Expert. Analyze and rebuild this resume professionally. Return ONLY valid JSON.
Resume:
${resume.extractedText.substring(0, 4500)}

Return ONLY JSON matching schema:
{
  "originalATS": 45,
  "improvedATS": 90,
  "improvedResume": "<complete rewritten resume in markdown>",
  "changes": [
    {
      "section": "Summary",
      "original": "...",
      "improved": "...",
      "type": "added",
      "description": "..."
    }
  ]
}`;

    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192
      }
    });

    console.log("Sending query directly to gemini-2.5-flash...");
    const result = await model.generateContent(prompt);
    const candidate = result.response.candidates[0];
    console.log("Candidate finish reason:", candidate?.finishReason);
    console.log("Safety ratings:", JSON.stringify(candidate?.safetyRatings));
    console.log("Finish message (if any):", candidate?.finishMessage);
    console.log("Response text length:", result.response.text().length);
    console.log("Response ends with:", result.response.text().substring(result.response.text().length - 300));
  } catch (error) {
    console.error("Error encountered:", error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
