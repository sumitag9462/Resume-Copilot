const { generateContentWithFallback } = require("./aiHelper");

const generateInterviewQuestions = async (resumeText, jobRole = "", jobDescription = "") => {
  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error("Please provide at least some resume content.");
  }

  const prompt = `You are a world-class Technical Interviewer and Career Coach.
Analyze the following resume and job description, then generate 25 highly personalized interview questions.

Resume:
"${resumeText.substring(0, 4500)}"

Target Role: "${jobRole || "Software Engineer"}"

Job Description (JD):
"${jobDescription ? jobDescription.substring(0, 2500) : "Not provided"}"

Guidelines for Questions:
- The questions MUST be personalized and deeply customized based on the candidate's actual projects, skills, experience, and the target role/JD. Do not generate generic internet interview questions.
- Focus on real interviewer-style questions.
- Generate EXACTLY 25 questions distributed across these categories and counts:
  1. Resume Questions (5 questions) - probing their background, achievements, choices, and statements on the resume.
  2. Technical Questions (5 questions) - specialized technical queries based on programming languages/frameworks listed in the resume (Do not ask about languages not in the resume!).
  3. Project Questions (5 questions) - deep-dives into specific projects on their resume, asking about system design, choices, challenges, scaling, API failures, etc.
  4. Behavioral Questions (3 questions) - STAR-format questions (conflicts, deadlines, leadership, pressures, failures).
  5. HR Questions (2 questions) - career goals, weaknesses, why this company, etc.
  6. JD-Based Questions (3 questions) - questions testing key concepts matching the job description expectations.
  7. Missing Skill Questions (2 questions) - checking their familiarity or pick-up readiness for required skills in the JD that are not listed or weak in their resume (e.g. if JD requires Docker/Redis and candidate lacks them, ask conceptual questions about containers/caching to check their understanding).

Additionally, perform an AI Feedback analysis:
1. matchPercentage: An integer between 0 and 100 indicating how well the candidate's resume aligns with the target job role and Job Description.
2. strongSkills: Array of up to 5 key skills the candidate possesses strongly, based on the resume.
3. weakSkills: Array of up to 5 missing or weak skills relative to the Job Description requirements.

Response Format:
Return ONLY a valid JSON object matching the schema below. No markdown backticks (e.g., do not wrap in \`\`\`json), no trailing text, and no explanations.

Schema:
{
  "matchPercentage": 85,
  "strongSkills": ["React", "Node.js", "MongoDB"],
  "weakSkills": ["Docker", "Redis", "AWS"],
  "questions": [
    {
      "type": "Resume",
      "difficulty": "Easy",
      "question": "Tell me about yourself.",
      "expectedAnswer": "A professional summary that highlights experience in React and Node.js...",
      "keywords": ["React", "Node.js", "Experience"],
      "followup": "What is your primary area of focus?",
      "tips": "Tailor the summary to align with the software engineer position."
    },
    {
      "type": "Technical",
      "difficulty": "Medium",
      "question": "Explain JWT Authentication.",
      "expectedAnswer": "JWT consists of Header, Payload and Signature...",
      "keywords": ["Bearer Token", "Refresh Token", "Secret", "Expiry"],
      "followup": "Why JWT over Sessions?",
      "tips": "Mention stateless authentication."
    }
  ]
}`;

  const result = await generateContentWithFallback(prompt, { maxOutputTokens: 6000 });

  const raw = result.response.text().trim();
  const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error("Gemini raw output:", raw);
    throw new Error("AI returned invalid JSON format. Please try again.");
  }

  if (!parsed.questions || !Array.isArray(parsed.questions)) {
    throw new Error("AI response missing questions array.");
  }

  // Double check fields
  parsed.questions = parsed.questions.map(q => ({
    type: q.type || "Technical",
    difficulty: q.difficulty || "Medium",
    question: q.question || "Tell me about your tech stack.",
    expectedAnswer: q.expectedAnswer || "",
    keywords: Array.isArray(q.keywords) ? q.keywords : [],
    followup: q.followup || "",
    tips: q.tips || ""
  }));

  return parsed;
};

module.exports = { generateInterviewQuestions };
