const { generateContentWithFallback } = require("./aiHelper");

/**
 * Rebuilds the user's resume using Gemini AI to enhance ATS compatibility,
 * reorder skills, improve projects and summary, and detail change logs.
 * 
 * @param {string} resumeText Extracted plain text of the resume
 * @param {string} jobRole Target job role
 * @param {string} jobDescription Target job description
 * @returns {Promise<object>} Parsed AI Rebuild report and resume text
 */
const rebuildResumeService = async (resumeText, jobRole = "", jobDescription = "") => {
  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error("Resume content is too short or invalid.");
  }

  const prompt = `You are an ATS Resume Expert and Senior Technical Recruiter.
Analyze the following resume and completely rebuild it into a highly ATS-optimized and recruiter-friendly version.

Guidelines:
- STRICT RULE: Keep all information entirely TRUTHFUL. Do NOT invent, fabricate, or hallucinate any professional experience, internships, companies, projects, GPAs, certifications, soft/hard skills, or achievements that are not already present in the original resume. Only rewrite and enhance existing statements.
- Rewrite all sections professionally using strong action verbs, quantifiable metrics, and active voice.
- Rewrite the professional summary into a high-impact recruiter-friendly statement.
- Enhance project descriptions using the formula: Action Verb + Technologies + Impact/Performance/Business Value.
- Optimize keyword density for the Target Role: "${jobRole || "Software Engineer"}" and Job Description: "${jobDescription || "Not provided"}". Add missing keywords naturally without keyword stuffing.
- Rewrite every experience bullet professionally using the STAR format (keep under 30 words per bullet).
- Automatically reorder all skills into these exact categories where relevant: Programming Languages, Frontend, Backend, Databases, Cloud, Developer Tools, Core CS Subjects, Soft Skills.
- Format the final improved resume text cleanly in a professional Markdown format, keeping sections (Name, Contact, Summary, Education, Experience, Projects, Skills) structured.
- **IMPORTANT**: In the "changes" array, list ONLY the 5 to 8 most critical, high-impact changes made (do not list every single minor modification). This keeps the response compact and prevents truncation.

Original Resume:
"${resumeText.substring(0, 4500)}"

Return ONLY a valid JSON object matching the schema below. No markdown backticks (do not wrap in \`\`\`json), no trailing text, and no explanations.

Schema:
{
  "originalATS": <integer 0-100, estimate of original ATS rating>,
  "improvedATS": <integer 0-100, estimate of improved ATS rating, should be significantly higher>,
  "improvedResume": "<complete rebuilt resume in markdown format, maintaining factual accuracy>",
  "changes": [
    // Limit to a maximum of 8 high-impact changes
    {
      "section": "Summary" | "Experience" | "Projects" | "Achievements" | "Skills",
      "original": "<original bullet/text chunk>",
      "improved": "<rewritten bullet/text chunk>",
      "type": "added" | "modified" | "removed",
      "description": "<reasoning/feedback for why this change was made>"
    }
  ],
  "recruiterFeedback": "<general evaluation of the original resume and key fixes>",
  "suggestions": [
    "<suggestion 1>",
    "<suggestion 2>"
  ],
  "keywordReport": {
    "missing": ["<missing keyword 1>", "<missing keyword 2>"],
    "added": ["<added keyword 1>", "<added keyword 2>"]
  },
  "scores": {
    "grammar": <number 0-100>,
    "readability": <number 0-100>,
    "keywordMatch": <number 0-100>,
    "formatting": <number 0-100>,
    "content": <number 0-100>,
    "section": <number 0-100>
  }
}`;

  const result = await generateContentWithFallback(prompt, { maxOutputTokens: 6000 });

  const raw = result.response.text().trim();
  const match = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  const cleaned = match ? match[0] : raw.trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error("Gemini raw output:", raw);
    throw new Error("AI returned invalid JSON. Please try again.");
  }

  // Ensure required fields exist
  if (!parsed.improvedResume) {
    throw new Error("AI response missing rebuilt resume content.");
  }
  if (!parsed.changes || !Array.isArray(parsed.changes)) {
    parsed.changes = [];
  }

  return parsed;
};

module.exports = {
  rebuildResumeService
};
