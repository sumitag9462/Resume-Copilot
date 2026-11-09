// services/geminiService.js — UNIFIED GEMINI AI SERVICE ADAPTER (A11)
//
// Delegates legacy analysis functions to the authoritative executeArenaRun engine in ComparisonEngine.js.
// Keeps legacy endpoints and contracts fully operational while eliminating dual diverging pipelines.

const { executeArenaRun } = require('./ComparisonEngine');

/**
 * Performs full ATS analysis on a resume via authoritative pipeline.
 */
const analyzeResume = async (resumeText) => {
  const runResult = await executeArenaRun('ats_analysis', { resumeText }, 'auto', false);
  const successResult = runResult.results.find(r => !r.error && r.output);
  if (!successResult) {
    const err = new Error(runResult.results[0]?.error || 'Failed to analyze resume');
    err.statusCode = 502;
    throw err;
  }
  return successResult.output;
};

/**
 * Matches resume against job description via authoritative pipeline.
 */
const matchResumeWithJob = async (resumeText, jobDescription) => {
  const runResult = await executeArenaRun('jd_match', { resumeText, jobDescription }, 'auto', false);
  const successResult = runResult.results.find(r => !r.error && r.output);
  if (!successResult) {
    const err = new Error(runResult.results[0]?.error || 'Failed to match resume with job description');
    err.statusCode = 502;
    throw err;
  }
  return successResult.output;
};

/**
 * Generates personalized cover letter via authoritative pipeline.
 */
const generateCoverLetter = async (resumeText, companyName, jobDescription, style = 'professional') => {
  const runResult = await executeArenaRun('cover_letter', { resumeText, companyName, jobDescription, style }, 'auto', false);
  const successResult = runResult.results.find(r => !r.error && r.output);
  if (!successResult) {
    const err = new Error(runResult.results[0]?.error || 'Failed to generate cover letter');
    err.statusCode = 502;
    throw err;
  }
  return successResult.output;
};

/**
 * Backward compatibility helper for JD analysis.
 */
const analyzeJobDescription = async (jdText) => {
  const runResult = await executeArenaRun('jd_match', { resumeText: 'General Software Experience', jobDescription: jdText }, 'auto', false);
  const output = runResult.results.find(r => !r.error)?.output || {};
  return {
    jobRole: 'Software Engineer',
    company: 'Not specified',
    requiredSkills: output.missingSkills || [],
    preferredSkills: output.matchedSkills || [],
    keywords: output.keywordGap || [],
    responsibilities: output.recommendations || []
  };
};

/**
 * Backward compatibility helper for quick tips.
 */
const getQuickTips = async (resumeText) => {
  const runResult = await executeArenaRun('ats_analysis', { resumeText }, 'auto', false);
  const output = runResult.results.find(r => !r.error)?.output || {};
  return {
    tips: (output.suggestions || []).map((tip, idx) => ({
      tip,
      priority: idx === 0 ? 'high' : 'medium',
      section: 'General'
    }))
  };
};

module.exports = {
  analyzeResume,
  analyzeJobDescription,
  matchResumeWithJob,
  generateCoverLetter,
  getQuickTips
};
