// ============================================================
// middleware/uploadMiddleware.js — SECURE FILE UPLOAD CONFIG (MULTER)
//
// 1. Unpredictable cryptographically secure random names (UUID)
// 2. Strict file size limit (5MB)
// 3. Allowed MIME types (PDF and DOCX)
// 4. Absolute storage path containment
// ============================================================

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');
const crypto = require('crypto');

// Absolute path to upload directory
const uploadDir = path.resolve(__dirname, '../uploads/resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ── STORAGE CONFIG ──────────────────────────────────────────
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ext === '.docx' ? '.docx' : '.pdf';
    // Use cryptographically secure UUID to prevent filename collision or predictable enumeration
    const uniqueName = `${crypto.randomUUID()}${safeExt}`;
    cb(null, uniqueName);
  }
});

// ── FILE TYPE FILTER ────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOCX are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024  // 5MB limit
  }
});

module.exports = upload;
