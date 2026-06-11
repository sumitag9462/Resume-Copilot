// ─────────────────────────────────────────────────
// services/interviewQuestionsService.js
// Drop into your existing services/ folder
// ─────────────────────────────────────────────────

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const model = genAI.getGenerativeModel({ model: geminiModel });

const generateInterviewQuestions = async (resumeText, jobDescription = "", jobRole = "") => {
  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error("Please provide at least some resume content.");
  }

  const prompt = `You are a senior interviewer at a top tech company. Generate interview questions based on this candidate's resume and the job they are applying for.

RESUME:
${resumeText.substring(0, 3000)}

JOB DESCRIPTION (if provided):
${jobDescription ? jobDescription.substring(0, 1500) : "Not provided — generate role-appropriate questions based on the resume."}

TARGET ROLE: ${jobRole || "Software Engineer"}

Generate exactly 12 interview questions, split into 4 categories (3 questions each).
For EACH question, also provide:
- A suggested answer framework (STAR format pointer, 1-2 sentences max)
- Difficulty: "Easy" | "Medium" | "Hard"
- The specific part of the resume that triggered this question

Return ONLY a JSON object — no markdown, no backticks, no explanation:
{
  "candidateName": "<name from resume if found, else 'Candidate'>",
  "targetRole": "${jobRole || "Software Engineer"}",
  "categories": [
    {
      "name": "Behavioral",
      "icon": "behavior",
      "description": "Tests soft skills and past experiences",
      "questions": [
        {
          "id": 1,
          "question": "...",
          "answerHint": "Use STAR: describe a specific situation where...",
          "difficulty": "Medium",
          "resumeTrigger": "Based on your [specific experience/skill]"
        }
      ]
    },
    {
      "name": "Technical",
      "icon": "code",
      "description": "Tests technical depth and problem-solving",
      "questions": [...]
    },
    {
      "name": "Situational",
      "icon": "scenario",
      "description": "Tests how you'd handle future scenarios",
      "questions": [...]
    },
    {
      "name": "Role-Specific",
      "icon": "role",
      "description": "Tests fit for this specific position",
      "questions": [...]
    }
  ]
}`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.8, maxOutputTokens: 2000 },
  });

  const raw = result.response.text().trim();
  const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("AI returned invalid format. Please try again.");
  }

  if (!parsed.categories || !Array.isArray(parsed.categories)) {
    throw new Error("AI response missing question categories.");
  }

  return parsed;
};

module.exports = { generateInterviewQuestions };