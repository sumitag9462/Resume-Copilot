// ============================================================
// controllers/analysisController.js — ANALYSIS LOGIC
//
// This controller is the bridge between:
//   Frontend API calls  →  Gemini AI service  →  MongoDB
//
// Every function follows the same pattern:
//   1. Validate input (resumeId, jobDescription, etc.)
//   2. Fetch the resume from MongoDB (to get extractedText)
//   3. Verify the resume belongs to the logged-in user (security)
//   4. Call the correct Gemini service function
//   5. Save the result to the Analysis collection
//   6. Return the saved analysis to the frontend
//
// ROUTES HANDLED:
//   POST GET /api/analysis/ats             → runATSAnalysis()
//   POST     /api/analysis/match           → matchWithJob()
//   POST     /api/analysis/cover-letter    → createCoverLetter()
//   GET      /api/analysis/history/:resumeId → getHistory()
//   GET      /api/analysis/:id             → getAnalysisById()
// ============================================================

const Analysis  = require('../models/Analysis');
const Resume    = require('../models/Resume');
const {
  analyzeResume,
  matchResumeWithJob,
  generateCoverLetter,
} = require('../services/geminiService');


// ── HELPER: fetch resume and verify ownership ────────────────
// Used by every controller to DRY up the "find + auth check" logic.
const getOwnedResume = async (resumeId, userId) => {
  const resume = await Resume.findById(resumeId);
  if (!resume) {
    const err = new Error('Resume not found');
    err.statusCode = 404;
    throw err;
  }
  if (resume.user.toString() !== userId.toString()) {
    const err = new Error('Not authorized to access this resume');
    err.statusCode = 403;
    throw err;
  }
  return resume;
};

const findCachedAnalysis = async (query) => {
  return Analysis.findOne(query).sort({ createdAt: -1 });
};


// ─────────────────────────────────────────────────────────────
// @desc    Run ATS analysis on a resume
// @route   POST /api/analysis/ats
// @access  Private
// body:    { resumeId }
// ─────────────────────────────────────────────────────────────
const runATSAnalysis = async (req, res, next) => {
  try {
    const resumeId = req.body.resumeId || req.params.id;

    if (!resumeId) {
      return res.status(400).json({ success: false, message: 'resumeId is required' });
    }

    // Fetch resume and check ownership
    const resume = await getOwnedResume(resumeId, req.user._id);

    const cachedAnalysis = await findCachedAnalysis({
      resume: resume._id,
      user: req.user._id,
      type: 'ats_analysis'
    });

    if (cachedAnalysis && !req.body.forceRefresh) {
      return res.status(200).json({
        success: true,
        message: 'Using cached ATS analysis',
        analysis: { ...cachedAnalysis.toObject(), cached: true }
      });
    }

    // Call Gemini AI — this is the slow step (10-20 seconds)
    const aiResult = await analyzeResume(resume.extractedText);

    // Save analysis to MongoDB
    const analysis = await Analysis.create({
      resume:          resume._id,
      user:            req.user._id,
      type:            'ats_analysis',
      atsScore:        aiResult.atsScore,
      overallScore:    aiResult.overallScore,
      missingKeywords: aiResult.missingKeywords || [],
      suggestions:     aiResult.suggestions     || [],
      grammarIssues:   aiResult.grammarIssues   || [],
      sectionFeedback: aiResult.sectionFeedback || {},
      strengths:       aiResult.strengths       || [],
      weaknesses:      aiResult.weaknesses      || [],
    });

    res.status(201).json({
      success:  true,
      message:  'ATS analysis complete',
      analysis,
    });

  } catch (error) {
    next(error);
  }
};


// ─────────────────────────────────────────────────────────────
// @desc    Match resume against a job description
// @route   POST /api/analysis/match
// @access  Private
// body:    { resumeId, jobDescription }
// ─────────────────────────────────────────────────────────────
const matchWithJob = async (req, res, next) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'resumeId and jobDescription are required',
      });
    }

    if (jobDescription.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Job description is too short. Please paste the full JD.',
      });
    }

    const resume = await getOwnedResume(resumeId, req.user._id);
    const normalizedJD = jobDescription.trim();

    const cachedAnalysis = await findCachedAnalysis({
      resume: resume._id,
      user: req.user._id,
      type: 'jd_match',
      jobDescription: normalizedJD,
    });

    if (cachedAnalysis && !req.body.forceRefresh) {
      return res.status(200).json({
        success: true,
        message: 'Using cached JD match analysis',
        analysis: { ...cachedAnalysis.toObject(), cached: true }
      });
    }

    // Call Gemini AI
    const aiResult = await matchResumeWithJob(resume.extractedText, normalizedJD);

    // Save to MongoDB
    const analysis = await Analysis.create({
      resume:          resume._id,
      user:            req.user._id,
      type:            'jd_match',
      jobDescription:  jobDescription,
      matchScore:      aiResult.matchScore,
      skillCoverage:   aiResult.skillCoverage,
      keywordCoverage: aiResult.keywordCoverage,
      matchedSkills:   aiResult.matchedSkills   || [],
      missingSkills:   aiResult.missingSkills   || [],
      recommendations: aiResult.recommendations || [],
      // Store verdict and summary inside recommendations array as extra fields
      // We attach them directly on the returned object for the frontend
    });

    // Attach verdict and summary to response (Gemini returns them but schema doesn't store them)
    const responseData = {
      ...analysis.toObject(),
      verdict: aiResult.verdict,
      summary: aiResult.summary,
    };

    res.status(201).json({
      success:  true,
      message:  'JD match analysis complete',
      analysis: responseData,
    });

  } catch (error) {
    next(error);
  }
};


// ─────────────────────────────────────────────────────────────
// @desc    Generate a cover letter
// @route   POST /api/analysis/cover-letter
// @access  Private
// body:    { resumeId, companyName, jobDescription, style }
// ─────────────────────────────────────────────────────────────
const createCoverLetter = async (req, res, next) => {
  try {
    const {
      resumeId,
      companyName,
      jobDescription,
      style = 'professional',
    } = req.body;

    if (!resumeId || !companyName || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'resumeId, companyName, and jobDescription are required',
      });
    }

    const validStyles = ['professional', 'formal', 'startup', 'creative'];
    if (!validStyles.includes(style)) {
      return res.status(400).json({
        success: false,
        message: `style must be one of: ${validStyles.join(', ')}`,
      });
    }

    const resume = await getOwnedResume(resumeId, req.user._id);
    const normalizedJD = jobDescription.trim();

    const cachedAnalysis = await findCachedAnalysis({
      resume: resume._id,
      user: req.user._id,
      type: 'cover_letter',
      companyName,
      jobDescription: normalizedJD,
      style,
    });

    if (cachedAnalysis && !req.body.forceRefresh) {
      return res.status(200).json({
        success: true,
        message: 'Using cached cover letter',
        analysis: { ...cachedAnalysis.toObject(), cached: true }
      });
    }

    // Call Gemini AI
    const aiResult = await generateCoverLetter(
      resume.extractedText,
      companyName,
      normalizedJD,
      style
    );

    // Save to MongoDB
    const analysis = await Analysis.create({
      resume:             resume._id,
      user:               req.user._id,
      type:               'cover_letter',
      companyName:        companyName,
      jobDescription:     jobDescription,
      style:              style,
      coverLetterContent: aiResult.coverLetter,
    });

    // Add wordCount and keyHighlights from AI response
    const responseData = {
      ...analysis.toObject(),
      wordCount:     aiResult.wordCount,
      keyHighlights: aiResult.keyHighlights || [],
    };

    res.status(201).json({
      success:  true,
      message:  'Cover letter generated successfully',
      analysis: responseData,
    });

  } catch (error) {
    next(error);
  }
};


// ─────────────────────────────────────────────────────────────
// @desc    Get all analysis history for a resume
// @route   GET /api/analysis/history/:resumeId
// @access  Private
// ─────────────────────────────────────────────────────────────
const getHistory = async (req, res, next) => {
  try {
    const { resumeId } = req.params;

    // Confirm the resume belongs to this user before returning history
    await getOwnedResume(resumeId, req.user._id);

    const analyses = await Analysis.find({
      resume: resumeId,
      user:   req.user._id,
    })
      // Exclude the large coverLetterContent and jobDescription from list view
      .select('-coverLetterContent -jobDescription')
      .sort({ createdAt: -1 });  // Newest first

    res.status(200).json({
      success:  true,
      count:    analyses.length,
      analyses,
    });

  } catch (error) {
    next(error);
  }
};


// ─────────────────────────────────────────────────────────────
// @desc    Get a single analysis by ID
// @route   GET /api/analysis/:id
// @access  Private
// ─────────────────────────────────────────────────────────────
const getAnalysisById = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    // Security check
    if (analysis.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, analysis });

  } catch (error) {
    next(error);
  }
};


// ─────────────────────────────────────────────────────────────
// @desc    Get dashboard statistics for user
// @route   GET /api/analysis/dashboard/stats
// @access  Private
// ─────────────────────────────────────────────────────────────
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const totalResumes = await Resume.countDocuments({ user: userId });

    // Find highest ATS score
    const highestAts = await Analysis.findOne({ user: userId, type: 'ats_analysis' })
      .sort({ atsScore: -1 })
      .select('atsScore');
    
    const maxScore = highestAts ? highestAts.atsScore : 0;

    // Calculate a dynamic Profile Strength based on max ATS score + resume count
    const profileStrength = totalResumes > 0 
      ? Math.min(100, Math.round((maxScore * 0.8) + (totalResumes * 5)))
      : 0;

    const totalCoverLetters = await Analysis.countDocuments({ user: userId, type: 'cover_letter' });

    // Fetch the 5 most recent activities
    const recentActivityRaw = await Analysis.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('type createdAt atsScore matchScore companyName jobRole');

    // Format activity for the frontend
    const recentActivity = recentActivityRaw.map(activity => {
      let title = 'Activity';
      let desc = '';
      let icon = 'ScanText';
      let color = 'text-accent-teal';

      if (activity.type === 'ats_analysis') {
        title = 'ATS Analysis Complete';
        desc = `Resume scored ${activity.atsScore}%`;
        icon = 'ScanText';
        color = 'text-accent-teal';
      } else if (activity.type === 'jd_match') {
        title = 'JD Match Complete';
        desc = `Matched with score ${activity.matchScore || 0}%`;
        icon = 'Briefcase';
        color = 'text-warning';
      } else if (activity.type === 'cover_letter') {
        title = 'Cover Letter Generated';
        desc = `Tailored for ${activity.jobRole || 'role'} at ${activity.companyName || 'company'}`;
        icon = 'FileText';
        color = 'text-accent-violet';
      }

      return {
        id: activity._id,
        type: activity.type,
        title,
        desc,
        time: activity.createdAt,
        icon,
        color
      };
    });

    // Score Trend Graph (last 5 scores)
    const recentScores = await Analysis.find({ user: userId, type: 'ats_analysis' })
      .sort({ createdAt: 1 })
      .limit(5)
      .select('atsScore createdAt');

    const scoreTrend = recentScores.map((score, index) => ({
      label: `Scan ${index + 1}`,
      score: score.atsScore
    }));

    res.status(200).json({
      success: true,
      stats: {
        atsScore: maxScore,
        profileStrength,
        totalResumes,
        totalCoverLetters,
        recentActivity,
        scoreTrend
      }
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {
  runATSAnalysis,
  matchWithJob,
  createCoverLetter,
  getHistory,
  getAnalysisById,
  getDashboardStats,
};