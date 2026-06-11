const { rebuildResumeService } = require("../services/resumeRebuildService");
const ResumeBoostHistory = require("../models/ResumeBoostHistory");
const Resume = require("../models/Resume");

// @desc    Rebuild resume professionally using AI
// @route   POST /api/resume/rebuild
// @access  Private
const rebuildResume = async (req, res) => {
  try {
    const { resumeText, resumeId, role, jobDescription } = req.body;

    let originalText = resumeText;

    // Resolve resumeId if provided
    if (resumeId) {
      const found = await Resume.findById(resumeId);
      if (!found) {
        return res.status(404).json({ success: false, message: "Selected resume not found." });
      }
      if (found.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "You are not authorized to use this resume." });
      }
      originalText = found.extractedText;
    }

    if (!originalText || originalText.trim().length < 50) {
      return res.status(400).json({ success: false, message: "Please provide valid resume text or select an uploaded resume." });
    }

    // Call AI Rebuild Service
    const aiResponse = await rebuildResumeService(originalText, role, jobDescription);

    // Save to Database
    const history = await ResumeBoostHistory.create({
      userId: req.user._id,
      originalResume: originalText,
      improvedResume: aiResponse.improvedResume,
      originalATS: aiResponse.originalATS || 0,
      improvedATS: aiResponse.improvedATS || 0,
      changes: aiResponse.changes || [],
      recruiterFeedback: aiResponse.recruiterFeedback || "",
      suggestions: aiResponse.suggestions || [],
      keywordReport: aiResponse.keywordReport || { missing: [], added: [] },
      scores: aiResponse.scores || { grammar: 0, readability: 0, keywordMatch: 0, formatting: 0, content: 0, section: 0 }
    });

    return res.status(201).json({
      success: true,
      message: "Resume rebuilt successfully.",
      historyId: history._id,
      ...aiResponse
    });
  } catch (error) {
    console.error("Rebuild resume error:", error.message);
    return res.status(500).json({ success: false, message: error.message || "Failed to rebuild resume." });
  }
};

// @desc    Get user's resume rebuild history
// @route   GET /api/resume/history
// @access  Private
const getRebuildHistory = async (req, res) => {
  try {
    const history = await ResumeBoostHistory.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      history
    });
  } catch (error) {
    console.error("Get rebuild history error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to retrieve rebuild history." });
  }
};

// @desc    Delete a resume rebuild history item
// @route   DELETE /api/resume/history/:id
// @access  Private
const deleteRebuildHistory = async (req, res) => {
  try {
    const historyItem = await ResumeBoostHistory.findById(req.params.id);
    if (!historyItem) {
      return res.status(404).json({ success: false, message: "Rebuild record not found." });
    }

    if (historyItem.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this record." });
    }

    await historyItem.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Resume rebuild record deleted successfully."
    });
  } catch (error) {
    console.error("Delete rebuild history error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to delete rebuild record." });
  }
};

module.exports = {
  rebuildResume,
  getRebuildHistory,
  deleteRebuildHistory
};
