const { generateInterviewQuestions } = require("../services/interviewQuestionsService");
const InterviewHistory = require("../models/InterviewHistory");
const Resume = require("../models/Resume");

// @desc    Generate interview questions
// @route   POST /api/interview/generate
// @access  Private
const generateQuestions = async (req, res) => {
  try {
    const { resume, resumeId, role, jobDescription } = req.body;

    let resumeText = resume;

    // Resolve resumeId if provided
    if (resumeId) {
      const foundResume = await Resume.findById(resumeId);
      if (!foundResume) {
        return res.status(404).json({ success: false, message: "Selected resume not found." });
      }
      if (foundResume.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "You are not authorized to use this resume." });
      }
      resumeText = foundResume.extractedText;
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ success: false, message: "Please provide valid resume text or select an uploaded resume." });
    }

    if (!role || role.trim() === "") {
      return res.status(400).json({ success: false, message: "Target role is required." });
    }

    // Call AI Generation Service
    const aiResponse = await generateInterviewQuestions(resumeText, role, jobDescription);

    // Save to Database
    const history = await InterviewHistory.create({
      userId: req.user._id,
      resume: resumeText,
      role: role.trim(),
      jobDescription: jobDescription || "",
      matchPercentage: aiResponse.matchPercentage || 0,
      strongSkills: aiResponse.strongSkills || [],
      weakSkills: aiResponse.weakSkills || [],
      questions: aiResponse.questions || []
    });

    return res.status(201).json({
      success: true,
      message: "Interview questions generated successfully.",
      historyId: history._id,
      matchPercentage: history.matchPercentage,
      strongSkills: history.strongSkills,
      weakSkills: history.weakSkills,
      questions: history.questions
    });
  } catch (error) {
    console.error("Generate interview questions error:", error.message);
    return res.status(500).json({ success: false, message: error.message || "Failed to generate questions." });
  }
};

// @desc    Regenerate questions for an existing session
// @route   POST /api/interview/regenerate
// @access  Private
const regenerateQuestions = async (req, res) => {
  try {
    const { historyId } = req.body;

    if (!historyId) {
      return res.status(400).json({ success: false, message: "History ID is required for regeneration." });
    }

    const history = await InterviewHistory.findById(historyId);
    if (!history) {
      return res.status(404).json({ success: false, message: "Interview history not found." });
    }

    if (history.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    // Call AI Generation Service with original details
    const aiResponse = await generateInterviewQuestions(history.resume, history.role, history.jobDescription);

    // Update existing record
    history.questions = aiResponse.questions || [];
    history.matchPercentage = aiResponse.matchPercentage || 0;
    history.strongSkills = aiResponse.strongSkills || [];
    history.weakSkills = aiResponse.weakSkills || [];
    await history.save();

    return res.status(200).json({
      success: true,
      message: "Interview questions regenerated successfully.",
      historyId: history._id,
      matchPercentage: history.matchPercentage,
      strongSkills: history.strongSkills,
      weakSkills: history.weakSkills,
      questions: history.questions
    });
  } catch (error) {
    console.error("Regenerate interview questions error:", error.message);
    return res.status(500).json({ success: false, message: error.message || "Failed to regenerate questions." });
  }
};

// @desc    Get interview history
// @route   GET /api/interview/history
// @access  Private
const getHistory = async (req, res) => {
  try {
    // Select all fields except the large 'resume' text field to optimize payload size
    const historyList = await InterviewHistory.find({ userId: req.user._id })
      .select("-resume")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      history: historyList
    });
  } catch (error) {
    console.error("Get history error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to retrieve history." });
  }
};

// @desc    Delete interview history record
// @route   DELETE /api/interview/history/:id
// @access  Private
const deleteHistory = async (req, res) => {
  try {
    const history = await InterviewHistory.findById(req.params.id);
    if (!history) {
      return res.status(404).json({ success: false, message: "Interview history record not found." });
    }

    if (history.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this history." });
    }

    await history.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Interview history record deleted successfully."
    });
  } catch (error) {
    console.error("Delete history error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to delete history record." });
  }
};

module.exports = {
  generateQuestions,
  regenerateQuestions,
  getHistory,
  deleteHistory
};
