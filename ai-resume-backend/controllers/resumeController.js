// ============================================================
// controllers/resumeController.js — RESUME CRUD & PRIVATE FILE ACCESS
//
// Handles: upload, list, get single, delete, and private file download/preview.
// Implements:
//   - A02: Authenticated, owner-authorized file preview/download
//   - A07: Relational cascade deletion (Analysis, ArenaHistory, InterviewHistory)
//   - A09: Controlled errors for scanned/image-only PDFs (<50 characters)
//   - A13: File magic bytes validation and asynchronous error cleanup
// ============================================================

const Resume     = require('../models/Resume');
const { parseFile } = require('../utils/fileParser');
const fs         = require('fs');
const path       = require('path');

// Helper: Validate file header magic bytes to prevent content-type spoofing
const validateMagicBytes = async (filePath, expectedType) => {
  let fd;
  try {
    fd = await fs.promises.open(filePath, 'r');
    const buffer = Buffer.alloc(8);
    await fd.read(buffer, 0, 8, 0);

    if (expectedType === 'pdf') {
      // PDF must begin with '%PDF' (0x25 0x50 0x44 0x46)
      return buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
    }
    if (expectedType === 'docx') {
      // DOCX is a ZIP archive beginning with PK\x03\x04 (0x50 0x4B 0x03 0x04)
      return buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04;
    }
    return false;
  } catch (err) {
    return false;
  } finally {
    if (fd) await fd.close().catch(() => {});
  }
};

// @desc    Upload a resume file
// @route   POST /api/resume/upload
// @access  Private
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please attach a PDF or DOCX file.'
      });
    }

    const { originalname, filename, path: filePath, mimetype } = req.file;
    const fileType = mimetype === 'application/pdf' ? 'pdf' : 'docx';

    // Verify magic bytes on disk
    const isValidSignature = await validateMagicBytes(filePath, fileType);
    if (!isValidSignature) {
      await fs.promises.unlink(filePath).catch(() => {});
      return res.status(400).json({
        success: false,
        message: 'Invalid file content. The file signature does not match a valid PDF or DOCX format.'
      });
    }

    // Extract text from the uploaded file
    let extractedText;
    try {
      extractedText = await parseFile(filePath, fileType);
    } catch (parseErr) {
      await fs.promises.unlink(filePath).catch(() => {});
      return res.status(400).json({
        success: false,
        message: `Could not parse document: ${parseErr.message}`
      });
    }

    // Validate extracted text length
    if (!extractedText || extractedText.length < 50) {
      await fs.promises.unlink(filePath).catch(() => {});
      return res.status(400).json({
        success: false,
        message: 'Could not extract readable text from the file. Scanned documents or image-only PDFs are not supported. Please upload a text-based PDF or DOCX file with at least 50 characters.'
      });
    }

    // Sanitize original file name
    const sanitizedOriginalName = path.basename(originalname).replace(/[^a-zA-Z0-9._ -]/g, '_');

    // Save resume record to MongoDB
    const resume = await Resume.create({
      user:          req.user._id,
      fileName:      filename,
      originalName:  sanitizedOriginalName,
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
        textPreview:  extractedText.substring(0, 300) + '...'
      }
    });
  } catch (error) {
    if (req.file && req.file.path) {
      await fs.promises.unlink(req.file.path).catch(() => {});
    }
    next(error);
  }
};

// @desc    Get all resumes uploaded by the logged-in user
// @route   GET /api/resume/all
// @access  Private
const getAllResumes = async (req, res, next) => {
  try {
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

    // SECURITY: IDOR boundary check
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

// @desc    Private, owner-authorized resume file preview or download (A02)
// @route   GET /api/resume/:id/file
// @access  Private
const getResumeFile = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Check ownership on EVERY request
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this resume file'
      });
    }

    // Path traversal containment check
    const resolvedPath = path.resolve(resume.filePath);
    const uploadsDir = path.resolve(__dirname, '../uploads/resumes');

    if (!resolvedPath.startsWith(uploadsDir)) {
      return res.status(403).json({
        success: false,
        message: 'Invalid file path: Access denied outside uploads directory'
      });
    }

    if (!fs.existsSync(resolvedPath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on storage server'
      });
    }

    // Set restrictive cache headers to prevent caching sensitive private documents on proxies/browsers
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    const isDownload = req.query.download === 'true';
    const disposition = isDownload ? 'attachment' : 'inline';
    const cleanFilename = resume.originalName.replace(/["\r\n\\]/g, '_');
    const safeFilename = encodeURIComponent(cleanFilename);
    res.setHeader('Content-Disposition', `${disposition}; filename="${cleanFilename}"; filename*=UTF-8''${safeFilename}`);

    const mimeType = resume.fileType === 'pdf'
      ? 'application/pdf'
      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    res.setHeader('Content-Type', mimeType);

    const fileStream = fs.createReadStream(resolvedPath);
    fileStream.on('error', (err) => next(err));
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a resume and cascade-delete dependent analyses and arena histories
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

    // Safely delete file from disk asynchronously
    if (resume.filePath) {
      try {
        const resolvedPath = path.resolve(resume.filePath);
        if (fs.existsSync(resolvedPath)) {
          await fs.promises.unlink(resolvedPath);
        }
      } catch (e) {
        console.warn('Filesystem cleanup warning during resume deletion:', e.message);
      }
    }

    // Delete MongoDB document
    await resume.deleteOne();

    // Cascading relational cleanup
    const Analysis = require('../models/Analysis');
    const ArenaHistory = require('../models/ArenaHistory');
    const InterviewHistory = require('../models/InterviewHistory');

    try {
      await Promise.all([
        Analysis.deleteMany({ resume: resume._id }),
        ArenaHistory.deleteMany({
          userId: req.user._id,
          $or: [
            { 'input.resumeId': resume._id.toString() },
            { 'input.resumeId': resume._id },
            { 'input.resumeIdA': resume._id.toString() },
            { 'input.resumeIdB': resume._id.toString() }
          ]
        }),
        InterviewHistory.deleteMany({
          userId: req.user._id,
          $or: [
            { resume: resume._id.toString() },
            { resume: resume._id }
          ]
        })
      ]);
    } catch (cleanupErr) {
      console.warn('Cascade cleanup partial warning during resume deletion:', cleanupErr.message);
    }

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadResume,
  getAllResumes,
  getResume,
  getResumeFile,
  deleteResume
};
