// ============================================================
// controllers/resumeController.js — RESUME CRUD LOGIC
//
// Handles: upload, list, get single, delete.
//
// File upload flow:
//   1. Multer middleware (uploadMiddleware.js) saves file to disk
//      and attaches req.file to the request object
//   2. We read req.file.path and pass it to fileParser.js
//   3. fileParser returns the extracted plain text
//   4. We save file metadata + extracted text to MongoDB
//
// Security: Every route checks that the logged-in user (req.user._id)
// owns the resume before allowing access or deletion.
// This prevents User A from accessing User B's resumes.
//
// ROUTES:
//   POST   /api/resume/upload  → uploadResume()   [protected]
//   GET    /api/resume/all     → getAllResumes()   [protected]
//   GET    /api/resume/:id     → getResume()       [protected]
//   DELETE /api/resume/:id     → deleteResume()    [protected]
// ============================================================

const Resume     = require('../models/Resume');
const { parseFile } = require('../utils/fileParser');
const fs         = require('fs');


// @desc    Upload a resume file
// @route   POST /api/resume/upload
// @access  Private
const uploadResume = async (req, res, next) => {
  try {
    // If no file was attached, Multer won't set req.file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please attach a PDF or DOCX file.'
      });
    }

    const { originalname, filename, path: filePath, mimetype } = req.file;

    // Determine file type from MIME type
    const fileType = mimetype === 'application/pdf' ? 'pdf' : 'docx';

    // Extract text from the uploaded file
    const extractedText = await parseFile(filePath, fileType);

    // Validate that we actually got some text back
    if (!extractedText || extractedText.length < 50) {
      // Clean up the uploaded file since it's unusable
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'Could not extract readable text from the file. Please ensure the PDF/DOCX contains actual text (not just images).'
      });
    }

    // Save resume record to MongoDB
    const resume = await Resume.create({
      user:          req.user._id,
      fileName:      filename,
      originalName:  originalname,
      fileType,
      filePath,
      extractedText
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully',
      resume: {
        _id:          resume._id,
        originalName: resume.originalName,
        fileType:     resume.fileType,
        createdAt:    resume.createdAt,
        // Send a preview of extracted text (for frontend to display)
        textPreview:  extractedText.substring(0, 300) + '...'
      }
    });
  } catch (error) {
    // If anything goes wrong, delete the file to avoid orphaned files
    if (req.file && req.file.path) {
      try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
    }
    next(error);
  }
};


// @desc    Get all resumes uploaded by the logged-in user
// @route   GET /api/resume/all
// @access  Private
const getAllResumes = async (req, res, next) => {
  try {
    // Only fetch this user's resumes (.find({ user: req.user._id }))
    // Exclude extractedText and filePath — they're large and not needed in list view
    // Sort by newest first (-1)
    const resumes = await Resume.find({ user: req.user._id })
      .select('-extractedText -filePath')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count:   resumes.length,
      resumes
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Get a single resume by ID (includes extracted text)
// @route   GET /api/resume/:id
// @access  Private
const getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // SECURITY: Check that this resume belongs to the logged-in user
    // .toString() is needed because ObjectId !== String without it
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this resume'
      });
    }

    res.status(200).json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};


// @desc    Delete a resume and its associated file
// @route   DELETE /api/resume/:id
// @access  Private
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Delete the actual file from disk
    try {
      fs.unlinkSync(resume.filePath);
    } catch (e) {
      // File might have already been deleted manually — just log and continue
      console.log('File not found on disk, continuing with DB deletion');
    }

    // Delete the MongoDB document
    await resume.deleteOne();

    // Also delete any dependent data (Analysis, ArenaHistory)
    const Analysis = require('../models/Analysis');
    const ArenaHistory = require('../models/ArenaHistory');
    
    try {
      await Analysis.deleteMany({ resume: resume._id });
      await ArenaHistory.deleteMany({ "input.resumeId": resume._id.toString() });
    } catch (cleanupErr) {
      console.error("Cleanup error during resume deletion:", cleanupErr);
    }

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};


module.exports = { uploadResume, getAllResumes, getResume, deleteResume };