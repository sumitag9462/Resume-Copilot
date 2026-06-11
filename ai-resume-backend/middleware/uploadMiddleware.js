// ============================================================
// middleware/uploadMiddleware.js — FILE UPLOAD CONFIG (MULTER)
//
// Multer is a Node.js middleware for handling multipart/form-data,
// which is the encoding type used when a form uploads files.
//
// We configure three things:
//   1. storage   → where to save files and what to name them
//   2. fileFilter → reject anything that isn't PDF or DOCX
//   3. limits    → max file size (5MB)
//
// multer.diskStorage vs multer.memoryStorage:
//   - diskStorage: saves file to disk → we get a file path
//   - memoryStorage: keeps file in RAM as Buffer → good for Cloudinary
//   We use diskStorage since we're saving locally.
//
// After upload, Multer adds a `req.file` object containing:
//   { originalname, filename, path, size, mimetype }
// ============================================================

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Create the uploads directory if it doesn't exist yet
const uploadDir = 'uploads/resumes';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ── STORAGE CONFIG ──────────────────────────────────────────
const storage = multer.diskStorage({
  // Where to save the file
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  // What to name the file on disk
  // We use userId + timestamp to guarantee a unique name
  filename: function (req, file, cb) {
    const ext        = path.extname(file.originalname); // ".pdf" or ".docx"
    const uniqueName = `${req.user._id}-${Date.now()}${ext}`;
    cb(null, uniqueName);
    // Example result: "64abc123-1704067200000.pdf"
  }
});

// ── FILE TYPE FILTER ────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);  // Accept the file
  } else {
    // Reject with an error (will be caught by errorHandler)
    cb(new Error('Invalid file type. Only PDF and DOCX are allowed.'), false);
  }
};

// ── ASSEMBLE MULTER INSTANCE ────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024  // 5MB in bytes
  }
});

module.exports = upload;