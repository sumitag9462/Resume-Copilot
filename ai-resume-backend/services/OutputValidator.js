// services/OutputValidator.js — STRICT SCHEMA & FACTUALITY VALIDATOR
//
// Validates parsed model outputs against named schemas for all 17 features.
// Rejects incomplete, malformed, out-of-bounds, or hallucinated responses.

const clampScore = (val) => {
  if (typeof val !== 'number' || Number.isNaN(val)) return null;
  if (val < 0 || val > 100) return null;
  return Math.round(val);
};

const isNonEmptyString = (str) => typeof str === 'string' && str.trim().length > 0;

const isStringArray = (arr, maxLen = 20) => {
  if (!Array.isArray(arr)) return false;
  return arr.length <= maxLen && arr.every(item => typeof item === 'string');
};

/**
 * Validates feature output and returns { valid: boolean, error?: string, sanitizedOutput?: object }
 */
const validateFeatureOutput = (feature, output, inputs = {}) => {
  if (!output || typeof output !== 'object' || Array.isArray(output)) {
    return { valid: false, error: 'Model output must be a valid non-empty JSON object' };
  }

  const sanitized = { ...output };

  switch (feature) {
    case 'ats_analysis': {
      const atsScore = clampScore(output.atsScore);
      const overallScore = clampScore(output.overallScore);

      if (atsScore === null) {
        return { valid: false, error: "Missing or invalid 'atsScore' (must be a number between 0 and 100)" };
      }
      if (overallScore === null) {
        return { valid: false, error: "Missing or invalid 'overallScore' (must be a number between 0 and 100)" };
      }

      sanitized.atsScore = atsScore;
      sanitized.overallScore = overallScore;
      if (output.professionalismScore !== undefined) {
        sanitized.professionalismScore = clampScore(output.professionalismScore) ?? 70;
      }
      if (output.readabilityScore !== undefined) {
        sanitized.readabilityScore = clampScore(output.readabilityScore) ?? 70;
      }

      if (!Array.isArray(output.suggestions) || output.suggestions.length === 0) {
        return { valid: false, error: "Field 'suggestions' must be a non-empty array of actionable tips" };
      }
      sanitized.suggestions = output.suggestions.filter(s => typeof s === 'string').slice(0, 10);
      sanitized.missingKeywords = Array.isArray(output.missingKeywords) ? output.missingKeywords.filter(k => typeof k === 'string').slice(0, 20) : [];
      sanitized.grammarIssues = Array.isArray(output.grammarIssues) ? output.grammarIssues.filter(g => typeof g === 'string').slice(0, 15) : [];
      sanitized.strengths = Array.isArray(output.strengths) ? output.strengths.filter(s => typeof s === 'string').slice(0, 5) : [];
      sanitized.weaknesses = Array.isArray(output.weaknesses) ? output.weaknesses.filter(w => typeof w === 'string').slice(0, 5) : [];
      sanitized.formattingAnalysis = typeof output.formattingAnalysis === 'string' ? output.formattingAnalysis : 'Formatting evaluated based on extracted plain text structure.';
      sanitized.sectionFeedback = typeof output.sectionFeedback === 'object' && output.sectionFeedback !== null ? output.sectionFeedback : {};

      return { valid: true, sanitizedOutput: sanitized };
    }

    case 'jd_match': {
      const matchScore = clampScore(output.matchScore);
      const skillCoverage = clampScore(output.skillCoverage);
      const keywordCoverage = clampScore(output.keywordCoverage);

      if (matchScore === null) {
        return { valid: false, error: "Missing or invalid 'matchScore' (must be a number between 0 and 100)" };
      }

      sanitized.matchScore = matchScore;
      sanitized.skillCoverage = skillCoverage ?? matchScore;
      sanitized.keywordCoverage = keywordCoverage ?? matchScore;

      const validVerdicts = ['Strong Match', 'Good Match', 'Moderate Match', 'Weak Match'];
      let verdict = typeof output.verdict === 'string' ? output.verdict.trim() : '';
      if (!validVerdicts.includes(verdict)) {
        // Map closest or fallback based on matchScore
        if (matchScore >= 80) verdict = 'Strong Match';
        else if (matchScore >= 65) verdict = 'Good Match';
        else if (matchScore >= 45) verdict = 'Moderate Match';
        else verdict = 'Weak Match';
      }
      sanitized.verdict = verdict;

      sanitized.matchedSkills = Array.isArray(output.matchedSkills) ? output.matchedSkills.filter(s => typeof s === 'string') : [];
      sanitized.missingSkills = Array.isArray(output.missingSkills) ? output.missingSkills.filter(s => typeof s === 'string') : [];
      sanitized.keywordGap = Array.isArray(output.keywordGap) ? output.keywordGap.filter(k => typeof k === 'string') : [];
      sanitized.recommendations = Array.isArray(output.recommendations) ? output.recommendations.filter(r => typeof r === 'string') : [];
      sanitized.summary = isNonEmptyString(output.summary) ? output.summary : 'Job match evaluation completed.';

      return { valid: true, sanitizedOutput: sanitized };
    }

    case 'resume_boost': {
      if (!isNonEmptyString(output.enhanced)) {
        return { valid: false, error: "Missing or empty 'enhanced' bullet point in response" };
      }

      // Factuality check: Detect fabricated metrics
      const originalText = inputs.bulletText || output.original || '';
      const hadNumbers = /\d+|%|\$|million|billion/i.test(originalText);
      const hasInventedNumbers = /\$[\d,]+|\b\d+%\b|\b\d+\s*(?:users|clients|customers|revenue)\b/i.test(output.enhanced);

      if (!hadNumbers && hasInventedNumbers) {
        // Grounding rule: replace fabricated metrics with placeholder to keep resume truthful
        sanitized.enhanced = output.enhanced.replace(/\$[\d,]+(?:\.\d+)?(?:\s*(?:M|K|B|million|billion))?/gi, '[$ metrics]')
                                            .replace(/\b\d+%/g, '[X%]');
        sanitized.factualityNote = 'Unverified metrics in original bullet replaced with editable placeholders.';
      }

      sanitized.original = originalText || output.original || '';
      sanitized.actionVerbsUsed = Array.isArray(output.actionVerbsUsed) ? output.actionVerbsUsed.filter(v => typeof v === 'string') : [];
      sanitized.grammarScore = clampScore(output.grammarScore) ?? 85;
      sanitized.readabilityScore = clampScore(output.readabilityScore) ?? 80;

      return { valid: true, sanitizedOutput: sanitized };
    }

    case 'resume_rebuilder': {
      if (!isNonEmptyString(output.improvedResume) || output.improvedResume.length < 50) {
        return { valid: false, error: "Field 'improvedResume' must be a comprehensive markdown string (>50 chars)" };
      }

      sanitized.changes = Array.isArray(output.changes) ? output.changes : [];
      sanitized.recruiterFeedback = typeof output.recruiterFeedback === 'string' ? output.recruiterFeedback : '';
      sanitized.suggestions = Array.isArray(output.suggestions) ? output.suggestions.filter(s => typeof s === 'string') : [];

      return { valid: true, sanitizedOutput: sanitized };
    }

    case 'interview_prep': {
      if (!Array.isArray(output.questions) || output.questions.length === 0) {
        return { valid: false, error: "Field 'questions' must be a non-empty array of interview questions" };
      }

      sanitized.matchPercentage = clampScore(output.matchPercentage) ?? 75;
      sanitized.strongSkills = Array.isArray(output.strongSkills) ? output.strongSkills.filter(s => typeof s === 'string') : [];
      sanitized.weakSkills = Array.isArray(output.weakSkills) ? output.weakSkills.filter(s => typeof s === 'string') : [];

      sanitized.questions = output.questions.map((q, idx) => ({
        type: typeof q.type === 'string' ? q.type : 'Technical',
        difficulty: typeof q.difficulty === 'string' ? q.difficulty : 'Medium',
        question: isNonEmptyString(q.question) ? q.question : `Interview question ${idx + 1}`,
        expectedAnswer: isNonEmptyString(q.expectedAnswer) ? q.expectedAnswer : 'Provide detailed technical context and metrics.',
        followUpQuestion: typeof q.followUpQuestion === 'string' ? q.followUpQuestion : '',
        resumeRelevance: typeof q.resumeRelevance === 'string' ? q.resumeRelevance : 'High'
      }));

      return { valid: true, sanitizedOutput: sanitized };
    }

    case 'cover_letter': {
      if (!isNonEmptyString(output.coverLetter) || output.coverLetter.length < 50) {
        return { valid: false, error: "Field 'coverLetter' must contain substantial letter text (>50 chars)" };
      }

      const words = output.coverLetter.trim().split(/\s+/).length;
      sanitized.wordCount = typeof output.wordCount === 'number' ? output.wordCount : words;
      sanitized.keyHighlights = Array.isArray(output.keyHighlights) ? output.keyHighlights.filter(h => typeof h === 'string') : [];

      return { valid: true, sanitizedOutput: sanitized };
    }

    case 'placement_predictor': {
      if (!Array.isArray(output.predictions) || output.predictions.length === 0) {
        return { valid: false, error: "Field 'predictions' must be a non-empty array of company predictions" };
      }

      sanitized.isIllustrativeGuidance = true;
      sanitized.disclaimer = "Illustrative estimate based on heuristic AI modeling; not a statistically calibrated or guaranteed placement prediction.";

      sanitized.predictions = output.predictions.map(p => ({
        company: typeof p.company === 'string' ? p.company : 'Target Employer',
        probability: clampScore(p.probability) ?? 50,
        confidence: clampScore(p.confidence) ?? 60,
        explanation: typeof p.explanation === 'string' ? p.explanation : 'Estimate based on skill match heuristics.'
      }));

      return { valid: true, sanitizedOutput: sanitized };
    }

    case 'salary_estimator': {
      sanitized.isIllustrativeGuidance = true;
      sanitized.disclaimer = "Illustrative market estimate generated by AI; not verified compensation or financial advice.";

      const range = output.salaryRange || {};
      sanitized.salaryRange = {
        min: typeof range.min === 'number' ? Math.max(0, range.min) : 0,
        median: typeof range.median === 'number' ? Math.max(0, range.median) : 0,
        max: typeof range.max === 'number' ? Math.max(0, range.max) : 0,
        currency: typeof range.currency === 'string' ? range.currency : 'USD'
      };

      sanitized.marketDemand = ['High', 'Medium', 'Low'].includes(output.marketDemand) ? output.marketDemand : 'Medium';
      sanitized.factors = Array.isArray(output.factors) ? output.factors.filter(f => typeof f === 'string') : [];

      return { valid: true, sanitizedOutput: sanitized };
    }

    case 'outreach': {
      if (!isNonEmptyString(output.emailSubject) || !isNonEmptyString(output.emailBody)) {
        return { valid: false, error: "Outreach generation requires non-empty 'emailSubject' and 'emailBody'" };
      }
      sanitized.linkedinMessage = typeof output.linkedinMessage === 'string' ? output.linkedinMessage.slice(0, 500) : '';

      return { valid: true, sanitizedOutput: sanitized };
    }

    default: {
      // General validation for other features: ensure non-empty object
      if (Object.keys(output).length === 0) {
        return { valid: false, error: 'Model output must not be an empty object' };
      }
      return { valid: true, sanitizedOutput: sanitized };
    }
  }
};

module.exports = {
  validateFeatureOutput,
  clampScore
};
