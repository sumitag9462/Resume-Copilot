// config/features.js — CENTRAL FEATURE CONFIGURATION
//
// Defines prompts, expected JSON response formats, auto-routing targets,
// and custom scoring criteria for each of the 16 features.

const FEATURES = {
  // 1. ATS Analysis
  "ats_analysis": {
    displayName: "ATS Analysis",
    autoModel: "gemini-pro", // Rebuilding/detailed analysis uses Pro
    buildPrompt: (inputs) => {
      const { resumeText } = inputs;
      return `You are an expert ATS (Applicant Tracking System) analyzer and resume coach.
Analyze the following resume and return details on score, keywords, suggestions, formatting, and grammar.

Resume:
"""
${resumeText}
"""

Return ONLY a valid JSON object matching this schema:
{
  "atsScore": 0-100 score,
  "overallScore": 0-100 score,
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "grammarIssues": ["issue1", "issue2"],
  "sectionFeedback": {
    "summary": "feedback text",
    "experience": "feedback text",
    "education": "feedback text",
    "skills": "feedback text",
    "projects": "feedback text"
  },
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "formattingAnalysis": "detailed formatting critique"
}`;
    }
  },

  // 2. JD Match
  "jd_match": {
    displayName: "JD Match",
    autoModel: "gemini-2.5-flash", // Medium reasoning uses Flash
    buildPrompt: (inputs) => {
      const { resumeText, jobDescription } = inputs;
      return `You are an ATS matching algorithm. Compare the resume against the job description below.
Identify match percentage, missing skills, keyword gap, and recommendations.

Resume:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription}
"""

Return ONLY a valid JSON object matching this schema:
{
  "matchScore": 0-100,
  "skillCoverage": 0-100,
  "keywordCoverage": 0-100,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["missing1", "missing2"],
  "keywordGap": ["gap1", "gap2"],
  "recommendations": ["rec1", "rec2"],
  "verdict": "Strong Match | Good Match | Moderate Match | Weak Match",
  "summary": "Match summary explanation"
}`;
    }
  },

  // 3. Resume Boost
  "resume_boost": {
    displayName: "Resume Boost",
    autoModel: "gemini-2.5-flash-lite", // Simple tasks use Flash Lite
    buildPrompt: (inputs) => {
      const { bulletText, targetRole } = inputs;
      return `You are a professional resume writer. Improve this single bullet point for the target role: "${targetRole || 'Software Engineer'}".
Quantify impact, use strong action verbs, and keep it truthful.

Original Bullet: "${bulletText}"

Return ONLY a valid JSON object matching this schema:
{
  "original": "original bullet",
  "enhanced": "improved bullet with metrics/quantifiable impact",
  "actionVerbsUsed": ["verb1", "verb2"],
  "grammarScore": 0-100,
  "atsKeywordsAdded": ["keyword1", "keyword2"],
  "readabilityScore": 0-100,
  "tone": "metrics-oriented | professional | results-focused"
}`;
    }
  },

  // 4. Resume Rebuilder
  "resume_rebuilder": {
    displayName: "Resume Rebuilder",
    autoModel: "gemini-pro", // Deep rebuilding/long doc uses Pro
    buildPrompt: (inputs) => {
      const { resumeText, targetRole, jobDescription } = inputs;
      return `You are an ATS Resume Editor. Rebuild this resume into a highly optimized, professional version for the role "${targetRole || 'Software Engineer'}" (Job Description: "${jobDescription || 'Not specified'}").
Preserve all factual information (names, dates, companies, degree, GPA). DO NOT hallucinate any skills, achievements, or employment histories.

Original Resume Text:
"""
${resumeText}
"""

Return ONLY a valid JSON object matching this schema:
{
  "improvedResume": "The full rebuilt resume content in clean, professional markdown format.",
  "changes": [
    {
      "section": "Summary | Experience | Projects | Skills",
      "original": "original content snippet",
      "improved": "improved content snippet",
      "type": "added | modified | removed",
      "description": "why this change makes it more ATS-friendly"
    }
  ],
  "recruiterFeedback": "recruiter-perspective feedback summary",
  "suggestions": ["improvement tip 1", "improvement tip 2"]
}`;
    }
  },

  // 5. Interview Prep
  "interview_prep": {
    displayName: "Interview Prep",
    autoModel: "gemini-pro", // Deep preparation uses Pro
    buildPrompt: (inputs) => {
      const { resumeText, targetRole, jobDescription } = inputs;
      return `You are an expert technical interviewer. Generate personalized interview questions based on the candidate's resume and target role.

Target Role: ${targetRole}
Job Description:
"""
${jobDescription || 'Not specified'}
"""

Resume:
"""
${resumeText}
"""

Return ONLY a valid JSON object matching this schema:
{
  "matchPercentage": 0-100,
  "strongSkills": ["skill1", "skill2"],
  "weakSkills": ["skill1", "skill2"],
  "questions": [
    {
      "type": "Technical | Behavioral | Resume | Project",
      "difficulty": "Easy | Medium | Hard",
      "question": "The question text",
      "expectedAnswer": "Brief points outlining what a strong answer contains",
      "followUpQuestion": "A related follow-up question",
      "resumeRelevance": "High | Medium | Low",
      "projectDepth": "Detailed | General",
      "relevanceExplanation": "Why this question matters for this candidate"
    }
  ]
}`;
    }
  },

  // 6. Cover Letter
  "cover_letter": {
    displayName: "Cover Letter",
    autoModel: "gemini-pro", // Cover letter generation uses Pro
    buildPrompt: (inputs) => {
      const { resumeText, companyName, jobDescription, style } = inputs;
      return `You are an expert writer. Write a cover letter for this candidate applying to "${companyName || 'Target Company'}" in the style "${style || 'professional'}".
Job Description:
"""
${jobDescription || 'Not specified'}
"""
Resume:
"""
${resumeText}
"""

STRICT RULE: Do NOT invent or hallucinate any projects, skills, or experiences. Use only the provided facts.

Return ONLY a valid JSON object matching this schema:
{
  "coverLetter": "Full cover letter text with \\n\\n separating paragraphs.",
  "wordCount": 0,
  "keyHighlights": ["highlight1", "highlight2"],
  "professionalismScore": 0-100,
  "grammarScore": 0-100,
  "customizationLevel": 0-100,
  "keywordUsage": "Good | Excellent | Needs Improvement",
  "recruiterAppeal": "Strong | Moderate | High"
}`;
    }
  },

  // 7. Resume Chat
  "resume_chat": {
    displayName: "Resume Chat",
    autoModel: "gemini-2.5-flash-lite", // Chat interactions use Flash Lite
    buildPrompt: (inputs) => {
      const { resumeText, message, chatHistory } = inputs;
      const historyStr = (chatHistory || []).map(h => `${h.role}: ${h.content}`).join("\n");
      return `You are a helpful Career Mentor. Talk to the candidate about their resume and career goals.
Resume Context:
"""
${resumeText}
"""

Chat History:
${historyStr}

User Message: "${message}"

Return ONLY a valid JSON object matching this schema:
{
  "response": "Your friendly, markdown-formatted response message.",
  "suggestedFollowUps": ["suggested follow-up question 1", "suggested follow-up question 2"],
  "contextUsed": "summary of resume sections referenced in response"
}`;
    }
  },

  // 8. Resume Comparison
  "resume_comparison": {
    displayName: "Resume Comparison",
    autoModel: "gemini-2.5-flash", // Comparing files uses Flash
    buildPrompt: (inputs) => {
      const { resumeTextA, resumeTextB } = inputs;
      return `You are a senior recruiter. Compare Resume A and Resume B side by side.
Highlight their differences in experience level, keyword optimization, presentation, and skills.

Resume A:
"""
${resumeTextA}
"""

Resume B:
"""
${resumeTextB}
"""

Return ONLY a valid JSON object matching this schema:
{
  "winner": "Resume A | Resume B | Tie",
  "atsComparison": "Critique of ATS capabilities of both",
  "readabilityComparison": "Critique of presentation/readability",
  "keywordComparison": "Compare keyword coverage",
  "detailedFeedback": "Overall side-by-side analysis report",
  "recommendation": "Which resume is better to use and why"
}`;
    }
  },

  // 9. Version Compare
  "version_compare": {
    displayName: "Version Compare",
    autoModel: "gemini-2.5-flash", // Flash matches Version Compare
    buildPrompt: (inputs) => {
      const { resumeText } = inputs;
      return `You are a resume optimization engine. Analyze this resume text and score its potential optimization across ATS, readability, length, recruiter score, and keyword density.

Resume:
"""
${resumeText}
"""

Return ONLY a valid JSON object matching this schema:
{
  "atsScore": 0-100,
  "readability": 0-100,
  "length": 0-100 (score on ideal length),
  "recruiterScore": 0-100,
  "keywordDensity": 0-100,
  "explanation": "Summary of current version stats"
}`;
    }
  },

  // 10. Career Mentor
  "career_mentor": {
    displayName: "Career Mentor",
    autoModel: "gemini-pro", // Complex career guidance uses Pro
    buildPrompt: (inputs) => {
      const { resumeText, query } = inputs;
      return `You are a high-level Career Coach and Mentor. Give expert advice to the candidate based on their resume and their question.

Question: "${query || 'What should I learn next?'}"

Resume:
"""
${resumeText}
"""

Return ONLY a valid JSON object matching this schema:
{
  "careerAdvice": "Detailed career advice in professional markdown",
  "skillsToLearn": ["skill1", "skill2", "skill3"],
  "recommendedRoles": ["role1", "role2"],
  "industryTrends": ["trend1", "trend2"],
  "mentorOpinion": "Overall supportive mentor summary"
}`;
    }
  },

  // 11. Roadmap Generator
  "roadmap_generator": {
    displayName: "Roadmap Generator",
    autoModel: "gemini-pro", // Detailed roadmaps use Pro
    buildPrompt: (inputs) => {
      const { resumeText, goal } = inputs;
      return `You are a curriculum developer. Generate a personalized step-by-step career learning roadmap for this goal: "${goal}" based on the candidate's existing background.

Resume:
"""
${resumeText}
"""

Return ONLY a valid JSON object matching this schema:
{
  "title": "Roadmap title",
  "duration": "e.g. 6 Months",
  "difficulty": "Beginner | Intermediate | Advanced",
  "steps": [
    {
      "phase": "Phase 1: Getting Started",
      "title": "Phase topic",
      "description": "Detailed description of what to learn and do",
      "resources": ["Resource Name / Link 1", "Resource Name / Link 2"],
      "estimatedTime": "e.g. 2 Weeks"
    }
  ]
}`;
    }
  },

  // 12. Project Analyzer
  "project_analyzer": {
    displayName: "Project Analyzer",
    autoModel: "gemini-2.5-flash", // Medium tasks use Flash
    buildPrompt: (inputs) => {
      const { resumeText, projectDescription } = inputs;
      return `You are a senior technical architect. Review this software project description and rate its complexity, architecture, scaling potential, and how it should be written on a resume.

Project details:
"""
${projectDescription}
"""

Candidate Background:
"""
${resumeText}
"""

Return ONLY a valid JSON object matching this schema:
{
  "architectureFeedback": "Critique of the architecture and stack",
  "complexityRating": 1-10 rating,
  "resumeWorthiness": 1-10 rating,
  "scalabilityTips": "Detailed suggestions to scale the project",
  "recruiterImpression": "How a hiring manager will view this project",
  "suggestions": ["Improvement suggestion 1", "Improvement suggestion 2"]
}`;
    }
  },

  // 13. Portfolio Analyzer
  "portfolio_analyzer": {
    displayName: "Portfolio Analyzer",
    autoModel: "gemini-2.5-flash", // Flash model
    buildPrompt: (inputs) => {
      const { portfolioDescription } = inputs;
      return `You are a web designer and developer reviewer. Analyze this portfolio description (or HTML layout) and evaluate its SEO, performance, design, accessibility, responsiveness.

Portfolio Description:
"""
${portfolioDescription}
"""

Return ONLY a valid JSON object matching this schema:
{
  "seoScore": 0-100,
  "performanceScore": 0-100,
  "designRating": 0-100,
  "accessibilityScore": 0-100,
  "responsivenessRating": 0-100,
  "detailedCritique": "Overall portfolio evaluation details"
}`;
    }
  },

  // 14. Recruiter Simulator
  "recruiter_simulator": {
    displayName: "Recruiter Simulator",
    autoModel: "gemini-2.5-flash", // Recruiter simulation fits Flash
    buildPrompt: (inputs) => {
      const { resumeText, jobDescription } = inputs;
      return `You are a critical, selective technical recruiter at a top tech company. Evaluate this resume against the job description. Be realistic and brutally honest.

Job Description:
"""
${jobDescription}
"""

Resume:
"""
${resumeText}
"""

Return ONLY a valid JSON object matching this schema:
{
  "decision": "Hire | Strong Hire | Maybe | Reject",
  "reasons": ["Reason 1", "Reason 2"],
  "criticalFeedback": "Honest recruiter critique on weaknesses or lack of fit",
  "hiringFitScore": 0-100
}`;
    }
  },

  // 15. Placement Predictor
  "placement_predictor": {
    displayName: "Placement Predictor",
    autoModel: "gemini-2.5-flash", // Flash model
    buildPrompt: (inputs) => {
      const { resumeText, targetRole } = inputs;
      return `You are a career statistician. Based on the resume and target role "${targetRole}", predict the candidate's hiring probability at Amazon, Google, Microsoft, Adobe, and Uber.
Use metrics, skills, and experience to assess odds.

Resume:
"""
${resumeText}
"""

Return ONLY a valid JSON object matching this schema:
{
  "predictions": [
    {
      "company": "Google | Amazon | Microsoft | Adobe | Uber",
      "probability": 0-100,
      "confidence": 0-100,
      "explanation": "Why this probability was calculated"
    }
  ]
}`;
    }
  },

  // 16. Salary Estimator
  "salary_estimator": {
    displayName: "Salary Estimator",
    autoModel: "gemini-2.5-flash-lite", // Fast estimates use Flash Lite
    buildPrompt: (inputs) => {
      const { resumeText, targetRole, location } = inputs;
      return `You are a salary negotiator and recruiter. Based on this resume, target role "${targetRole}", and location "${location || 'United States'}", estimate the market salary range.

Resume:
"""
${resumeText}
"""

Return ONLY a valid JSON object matching this schema:
{
  "salaryRange": {
    "min": 0,
    "median": 0,
    "max": 0,
    "currency": "USD"
  },
  "marketDemand": "High | Medium | Low",
  "factors": ["factor 1", "factor 2"]
}`;
    }
  }
};

module.exports = { FEATURES };
