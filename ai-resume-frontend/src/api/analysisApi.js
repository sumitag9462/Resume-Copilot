// =============================================================
// src/api/analysisApi.js — ANALYSIS API CALLS
//
// These call the /api/analysis routes which use Gemini AI.
// These can take 5-15 seconds to respond (AI processing time).
// Always show a loading state in the UI when calling these.
// =============================================================

import api from './axiosConfig'

// POST /api/analysis/ats
// Runs full ATS analysis on a resume
// Returns: atsScore, overallScore, keywords, suggestions, etc.
export const runATSAnalysis = async (resumeId) => {
  const response = await api.post('/analysis/ats', { resumeId })
  return response.data
}

// POST /api/analysis/match
// Matches resume against a job description
// Returns: matchScore, matchedSkills, missingSkills, recommendations
export const matchResumeWithJob = async (resumeId, jobDescription) => {
  const response = await api.post('/analysis/match', { resumeId, jobDescription })
  return response.data
}

// POST /api/analysis/cover-letter
// Generates a personalized cover letter
// style: 'professional' | 'formal' | 'startup' | 'creative'
export const generateCoverLetter = async (resumeId, companyName, jobDescription, style = 'professional') => {
  const response = await api.post('/analysis/cover-letter', {
    resumeId,
    companyName,
    jobDescription,
    style,
  })
  return response.data
}

// GET /api/analysis/history/:resumeId
// Returns all past analyses for a resume
export const getAnalysisHistory = async (resumeId) => {
  const response = await api.get(`/analysis/history/${resumeId}`)
  return response.data
}

// GET /api/analysis/:id
// Returns a single analysis by its ID
export const getAnalysisById = async (analysisId) => {
  const response = await api.get(`/analysis/${analysisId}`)
  return response.data
}

// GET /api/analysis/dashboard/stats
// Returns aggregated dashboard stats for the user
export const getDashboardStats = async () => {
  const response = await api.get('/analysis/dashboard/stats')
  return response.data
}