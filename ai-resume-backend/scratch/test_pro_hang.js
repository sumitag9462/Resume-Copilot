const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const { executeArenaRun } = require("../services/ComparisonEngine");
const Resume = require("../models/Resume");

const { MODELS } = require("../config/models");
MODELS["gemini-pro"].apiName = "gemini-2.5-flash";

async function testProHang() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB!");

    const resume = await Resume.findOne({});
    if (!resume) {
      console.error("No resume found!");
      return;
    }
    console.log(`Using resume: ${resume._id}`);

    const inputs = {
      resumeText: resume.extractedText,
      targetRole: "Software Engineer",
      jobDescription: `React Developer with Experience in Node.js and REST APIs.`
    };

    console.log("Running executeArenaRun for interview_prep on gemini-pro (mapped to gemini-2.5-flash)...");
    const startTime = Date.now();
    const runResult = await executeArenaRun("interview_prep", inputs, "gemini-pro", false);
    const duration = (Date.now() - startTime) / 1000;
    console.log(`Finished in ${duration}s!`);
    console.log("Questions Generated Count:", runResult.results?.[0]?.output?.questions?.length);
    console.log("Run Result Error:", runResult.results?.[0]?.error);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error in execution:", error);
  }
}

testProHang();
