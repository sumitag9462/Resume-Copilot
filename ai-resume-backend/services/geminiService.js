// ============================================================
// services/geminiService.js — GEMINI AI SERVICE
//
// This is the BRAIN of the entire application.
// All 4 AI features are here. Each function:
//   1. Takes text input (resume, job description, etc.)
//   2. Builds a structured prompt
//   3. Sends it to Gemini 1.5 Flash
//   4. Parses the JSON response
//   5. Returns a clean JavaScript object
//
// PROMPT ENGINEERING RULE (explain this in interviews!):
//   We explicitly tell the AI to return ONLY valid JSON.
//   We define the exact structure we want.
//   We use triple-quoted text blocks (""") to clearly separate
//   our instructions from the user's content.
//   This makes parsing reliable and consistent.
//
// IMPORTANT: If AI response has ```json ... ``` markdown code
//   blocks, our parseJSON helper strips them before parsing.
// ============================================================

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini client with our API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- MODEL PRIORITY LIST (all free tier) ---
const FREE_GEMINI_MODELS = [
  'gemini-2.5-flash',        // Primary: fastest + most capable free model
  'gemini-2.5-flash-lite'    // Fallback: lighter model
];

// ── HELPER: Safely parse JSON from AI response ─────────────
// Sometimes Gemini wraps JSON in markdown code blocks (```json ... ```)
// This function strips that wrapper before JSON.parse()
const parseJSON = (text) => {
  try {
    // Remove ```json and ``` if present, then trim whitespace
    const cleaned = text
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Raw AI response that failed to parse:', text);
    throw new Error('AI returned an invalid response. Please try again.');
  }
};

// ── HELPER: Generate content and return parsed JSON ────────
const generateAndParse = async (prompt) => {
  const maxRetriesPerModel = 3;

  for (const modelName of FREE_GEMINI_MODELS) {
    let attempt = 1;
    let delayMs = 2000;
    
    // Explicitly initialize model here for each iteration
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0,
        topK: 1,
        topP: 1,
        candidateCount: 1
      }
    });

    while (attempt <= maxRetriesPerModel) {
      try {
        console.log(`[geminiService] Attempting model ${modelName} (attempt ${attempt}/${maxRetriesPerModel})...`);
        const result = await model.generateContent(prompt);
        const text   = result.response.text();
        return parseJSON(text);
      } catch (err) {
        const isTemporary = 
          err.message?.includes("503") || 
          err.message?.includes("Service Unavailable") || 
          err.message?.includes("429") || 
          err.message?.includes("Quota exceeded") ||
          err.message?.includes("Resource exhausted") ||
          err.message?.includes("overloaded");

        if (isTemporary && attempt < maxRetriesPerModel) {
          console.warn(`[geminiService] Temporary error with ${modelName}: ${err.message}. Retrying in ${delayMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          delayMs *= 2;
          attempt++;
        } else {
          console.error(`[geminiService] Model ${modelName} failed on attempt ${attempt}. Moving to next model if available. Error: ${err.message}`);
          break; // Break the while loop to try the next model
        }
      }
    }
  }

  // If all models in the list fail
  throw new Error("Our AI models are currently experiencing extremely high demand. Please wait a moment and try again. We apologize for the inconvenience!");
};


// ─────────────────────────────────────────────────────────────
// FUNCTION 1: analyzeResume
// Performs full ATS analysis on a resume.
// Returns: atsScore, overallScore, keywords, suggestions, etc.
// ─────────────────────────────────────────────────────────────
const analyzeResume = async (resumeText) => {
  const prompt = `You are an expert ATS (Applicant Tracking System) analyzer and professional resume coach with 10+ years of experience.

Analyze the following resume and provide detailed, actionable feedback.

IMPORTANT: Return ONLY a valid JSON object. No explanations, no markdown, no extra text — just the raw JSON.

Resume Text:
"""
${resumeText}
"""

Return exactly this JSON structure (fill in real values based on the resume):
{
  "atsScore": <number between 0-100, how ATS-friendly this resume is>,
  "overallScore": <number between 0-100, overall resume quality>,
  "missingKeywords": [<list of important keywords missing from the resume>],
  "suggestions": [<list of 5-7 specific, actionable improvement suggestions>],
  "grammarIssues": [<list of specific grammar or spelling issues found, empty array if none>],
  "sectionFeedback": {
    "summary": "<feedback on the professional summary or objective section>",
    "experience": "<feedback on work experience section>",
    "education": "<feedback on education section>",
    "skills": "<feedback on skills section>",
    "projects": "<feedback on projects section, or note if absent>"
  },
  "strengths": [<list of 3-4 things the candidate does well>],
  "weaknesses": [<list of 3-4 areas that need improvement>]
}`;

  return await generateAndParse(prompt);
};


// ─────────────────────────────────────────────────────────────
// FUNCTION 2: analyzeJobDescription
// Extracts structured info from a job description.
// Returns: required skills, keywords, responsibilities, etc.
// ─────────────────────────────────────────────────────────────
const analyzeJobDescription = async (jdText) => {
  const prompt = `You are an expert recruiter and job market analyst.

Analyze this job description and extract all important information.

IMPORTANT: Return ONLY a valid JSON object. No extra text.

Job Description:
"""
${jdText}
"""

Return exactly this JSON structure:
{
  "jobRole": "<extracted job title>",
  "company": "<company name if mentioned, else 'Not specified'>",
  "requiredSkills": [<list of must-have skills>],
  "preferredSkills": [<list of nice-to-have skills>],
  "keywords": [<list of important keywords/technologies/terms>],
  "experienceRequired": "<experience requirement as a string>",
  "responsibilities": [<list of key responsibilities>],
  "technologies": [<list of specific technologies/tools/platforms mentioned>]
}`;

  return await generateAndParse(prompt);
};


// ─────────────────────────────────────────────────────────────
// FUNCTION 3: matchResumeWithJob
// Compares a resume against a specific job description.
// Returns: match score, skill gaps, recommendations.
// ─────────────────────────────────────────────────────────────
const matchResumeWithJob = async (resumeText, jdText) => {
  const prompt = `You are an expert ATS system and career counselor.

Your task: Compare this candidate's resume against the job description and provide a detailed match analysis.

IMPORTANT: Return ONLY a valid JSON object. No extra text.

Candidate's Resume:
"""
${resumeText}
"""

Job Description:
"""
${jdText}
"""

Return exactly this JSON structure:
{
  "matchScore": <number 0-100, overall match percentage>,
  "skillCoverage": <number 0-100, what percentage of required skills the candidate has>,
  "keywordCoverage": <number 0-100, what percentage of JD keywords appear in the resume>,
  "matchedSkills": [<skills that appear in BOTH resume and JD>],
  "missingSkills": [<skills required in JD but NOT found in resume>],
  "recommendations": [<5 specific recommendations to improve the resume for this job>],
  "verdict": "<one of: Strong Match / Good Match / Moderate Match / Weak Match>",
  "summary": "<2-3 sentence summary explaining the match result>"
}`;

  return await generateAndParse(prompt);
};


// ─────────────────────────────────────────────────────────────
// FUNCTION 4: generateCoverLetter
// Creates a personalized cover letter for a specific role.
// Returns: cover letter text, word count, key highlights.
// ─────────────────────────────────────────────────────────────
const generateCoverLetter = async (resumeText, companyName, jobDescription, style = 'professional') => {
  // Map style keys to human-readable descriptions
  const styleDescriptions = {
    professional: 'formal and polished tone, suitable for large corporations and MNCs',
    formal:       'highly formal and traditional language, very conservative and structured',
    startup:      'conversational and enthusiastic tone, shows energy and innovation fit for startups',
    creative:     'engaging and personalized tone that shows personality while remaining respectful'
  };

  const prompt = `You are a world-class cover letter writer specializing in helping candidates land their dream jobs.

Write a compelling, personalized cover letter for this candidate applying to ${companyName}.

Writing style: ${styleDescriptions[style] || styleDescriptions.professional}

Guidelines:
- Make it specific to the company and role (use the company name naturally)
- Highlight the candidate's most relevant experience and skills from the resume
- Show enthusiasm for the role
- Keep it to 3-4 paragraphs (around 300-400 words)
- Use \\n\\n between paragraphs
- STRICT RULE: DO NOT invent, fabricate, or hallucinate any projects, skills, or experiences. Use ONLY the facts provided in the resume.

IMPORTANT: Return ONLY a valid JSON object. No extra text.

Candidate's Resume:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription}
"""

Return exactly this JSON structure:
{
  "coverLetter": "<full cover letter text, with paragraphs separated by \\n\\n>",
  "wordCount": <approximate word count as a number>,
  "keyHighlights": [<3 key points the cover letter emphasizes>]
}`;

  return await generateAndParse(prompt);
};


// ─────────────────────────────────────────────────────────────
// FUNCTION 5: getQuickTips
// Returns 5 quick actionable tips for the resume.
// Used for a lightweight "quick check" feature.
// ─────────────────────────────────────────────────────────────
const getQuickTips = async (resumeText) => {
  const prompt = `You are a career coach. Review this resume and give exactly 5 quick, actionable improvement tips.

IMPORTANT: Return ONLY a valid JSON object. No extra text.

Resume:
"""
${resumeText}
"""

Return exactly this JSON structure:
{
  "tips": [
    {
      "tip": "<specific actionable tip>",
      "priority": "<high | medium | low>",
      "section": "<which resume section this applies to>"
    }
  ]
}`;

  return await generateAndParse(prompt);
};


module.exports = {
  analyzeResume,
  analyzeJobDescription,
  matchResumeWithJob,
  generateCoverLetter,
  getQuickTips
};