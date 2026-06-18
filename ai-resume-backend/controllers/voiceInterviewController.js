// ============================================================
// controllers/voiceInterviewController.js — VOICE INTERVIEW API
//
// Handles all voice interview HTTP endpoints:
//   POST /start    — Create session, get opening question
//   POST /message  — Send answer, get next question
//   POST /end      — Finish interview, get evaluation
//   GET  /history  — List past sessions
//   GET  /history/:id — Get full session details
//   DELETE /history/:id — Delete a session
// ============================================================

const VoiceInterviewSession = require('../models/VoiceInterviewSession');
const Resume = require('../models/Resume');
const { startInterview, continueChat, evaluateInterview } = require('../services/voiceInterviewService');


// @desc    Start a new voice interview session
// @route   POST /api/voice-interview/start
// @access  Private
const startInterviewSession = async (req, res) => {
  try {
    const { resumeText, resumeId, jobDescription, companyName, interviewType, companyMode, language } = req.body;

    let finalResumeText = resumeText;

    // Resolve resumeId if provided instead of raw text
    if (resumeId) {
      const resume = await Resume.findById(resumeId);
      if (!resume) {
        return res.status(404).json({ success: false, message: 'Resume not found.' });
      }
      if (resume.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to use this resume.' });
      }
      finalResumeText = resume.extractedText;
    }

    // Validate inputs
    if (!finalResumeText || finalResumeText.trim().length < 50) {
      return res.status(400).json({ success: false, message: 'Please provide valid resume text (at least 50 characters).' });
    }
    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({ success: false, message: 'Please provide a valid job description (at least 20 characters).' });
    }
    if (!companyName || companyName.trim().length < 1) {
      return res.status(400).json({ success: false, message: 'Please provide a company name.' });
    }

    // Call Gemini to start the interview
    const { aiResponse } = await startInterview(
      finalResumeText.trim(),
      jobDescription.trim(),
      companyName.trim(),
      interviewType || 'Technical',
      companyMode || 'General',
      language || 'English'
    );

    // Create the session in MongoDB
    const session = await VoiceInterviewSession.create({
      userId: req.user._id,
      resumeText: finalResumeText.trim(),
      jobDescription: jobDescription.trim(),
      companyName: companyName.trim(),
      companyMode: companyMode || 'General',
      interviewType: interviewType || 'Technical',
      status: 'active',
      chatHistory: [{
        role: 'model',
        content: aiResponse,
        timestamp: new Date()
      }],
      questionCount: 1,
      startedAt: new Date()
    });

    return res.status(201).json({
      success: true,
      sessionId: session._id,
      aiMessage: aiResponse,
      questionCount: 1,
      status: 'active'
    });

  } catch (error) {
    console.error('[voiceInterview] Start error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to start interview session.'
    });
  }
};


// @desc    Send a message (user answer) and get AI response
// @route   POST /api/voice-interview/message
// @access  Private
const sendInterviewMessage = async (req, res) => {
  try {
    const { sessionId, userAnswer } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID is required.' });
    }
    if (!userAnswer || userAnswer.trim().length < 1) {
      return res.status(400).json({ success: false, message: 'Please provide your answer.' });
    }

    // Load session
    const session = await VoiceInterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found.' });
    }
    if (session.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this session.' });
    }
    if (session.status !== 'active') {
      return res.status(400).json({ success: false, message: 'This interview session has already ended.' });
    }

    // Get AI response using conversation history
    const aiResponse = await continueChat(
      session.chatHistory,
      null, // systemPrompt will be rebuilt from context
      userAnswer.trim(),
      session.resumeText,
      session.jobDescription,
      session.companyName
    );

    // Append both messages to history
    session.chatHistory.push({
      role: 'user',
      content: userAnswer.trim(),
      timestamp: new Date()
    });
    session.chatHistory.push({
      role: 'model',
      content: aiResponse,
      timestamp: new Date()
    });
    session.questionCount += 1;
    await session.save();

    return res.status(200).json({
      success: true,
      aiMessage: aiResponse,
      questionCount: session.questionCount,
      transcript: session.chatHistory,
      status: 'active'
    });

  } catch (error) {
    console.error('[voiceInterview] Message error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to process your answer.'
    });
  }
};


// @desc    End interview and generate evaluation
// @route   POST /api/voice-interview/end
// @access  Private
const endInterviewSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID is required.' });
    }

    const session = await VoiceInterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found.' });
    }
    if (session.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this session.' });
    }
    if (session.status === 'completed') {
      // Return existing evaluation if already completed
      return res.status(200).json({
        success: true,
        evaluation: session.evaluation,
        transcript: session.chatHistory,
        questionCount: session.questionCount,
        status: 'completed'
      });
    }

    // Check minimum conversation length
    const userMessages = session.chatHistory.filter(m => m.role === 'user');
    if (userMessages.length < 1) {
      return res.status(400).json({
        success: false,
        message: 'Please answer at least one question before ending the interview.'
      });
    }

    // Generate evaluation using Gemini
    const evaluation = await evaluateInterview(
      session.chatHistory,
      session.resumeText,
      session.jobDescription,
      session.companyName
    );

    // Update session
    session.status = 'completed';
    session.endedAt = new Date();
    session.evaluation = evaluation;
    await session.save();

    return res.status(200).json({
      success: true,
      evaluation: session.evaluation,
      transcript: session.chatHistory,
      questionCount: session.questionCount,
      duration: session.endedAt - session.startedAt,
      status: 'completed'
    });

  } catch (error) {
    console.error('[voiceInterview] End error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate evaluation.'
    });
  }
};


// @desc    Get interview history (list of past sessions)
// @route   GET /api/voice-interview/history
// @access  Private
const getInterviewHistory = async (req, res) => {
  try {
    const sessions = await VoiceInterviewSession.find({ userId: req.user._id })
      .select('-resumeText -chatHistory -evaluation.technical.notes -evaluation.communication.notes -evaluation.confidence.notes -evaluation.leadership.notes -evaluation.problemSolving.notes -evaluation.behavior.notes -evaluation.cultureFit.notes -evaluation.resumeAuthenticity.notes -evaluation.domainKnowledge.notes')
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      sessions
    });
  } catch (error) {
    console.error('[voiceInterview] History error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve interview history.' });
  }
};


// @desc    Get a specific interview session with full details
// @route   GET /api/voice-interview/history/:id
// @access  Private
const getInterviewSession = async (req, res) => {
  try {
    const session = await VoiceInterviewSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }
    if (session.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this session.' });
    }

    return res.status(200).json({
      success: true,
      session
    });
  } catch (error) {
    console.error('[voiceInterview] Get session error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve session.' });
  }
};


// @desc    Delete an interview session
// @route   DELETE /api/voice-interview/history/:id
// @access  Private
const deleteInterviewSession = async (req, res) => {
  try {
    const session = await VoiceInterviewSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }
    if (session.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this session.' });
    }

    await session.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Interview session deleted successfully.'
    });
  } catch (error) {
    console.error('[voiceInterview] Delete error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to delete session.' });
  }
};


module.exports = {
  startInterviewSession,
  sendInterviewMessage,
  endInterviewSession,
  getInterviewHistory,
  getInterviewSession,
  deleteInterviewSession
};
