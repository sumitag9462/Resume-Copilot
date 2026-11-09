// ============================================================
// middleware/errorHandler.js — GLOBAL ERROR HANDLER
//
// In Express, any middleware with 4 parameters (err, req, res, next)
// is treated as an error-handling middleware.
//
// When you call next(error) anywhere in a controller, Express skips
// all regular middleware and jumps directly here.
//
// We centralize all error responses here so every error looks the
// same to the frontend: { success: false, message: "..." }
//
// We also handle specific Mongoose/JWT errors here instead of
// writing try-catch for each one in every controller.
// ============================================================

const redactSensitiveData = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/(password|token|otp|secret|jwt)\s*[:=]\s*["']?[^"'\s,]+["']?/gi, '$1: [REDACTED]')
    .replace(/bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, 'Bearer [REDACTED]');
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message    = err.message    || 'Internal Server Error';

  // ── BODY-PARSER: Payload too large (413) ───────────────────
  if (err.type === 'entity.too.large' || err.status === 413 || statusCode === 413) {
    statusCode = 413;
    message = 'Payload too large. Request body exceeds maximum allowed size.';
  }

  // ── CORS: Policy rejection ──────────────────────────────
  if (err.message && err.message.includes('CORS')) {
    statusCode = 403;
    message = err.message;
  }

  // ── MONGOOSE: Duplicate key (e.g., email already exists) ──
  // Error code 11000 = MongoDB duplicate key violation
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message    = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    statusCode = 400;
  }

  // ── MONGOOSE: Validation error (e.g., required field missing) ──
  if (err.name === 'ValidationError') {
    message    = Object.values(err.errors).map(e => e.message).join('. ');
    statusCode = 400;
  }

  // ── MONGOOSE: Invalid ObjectId (e.g., /api/resume/not-an-id) ──
  if (err.name === 'CastError') {
    message    = `Invalid ${err.path}: ${err.value}`;
    statusCode = 400;
  }

  // ── JWT: Token verification failed ──────────────────────
  if (err.name === 'JsonWebTokenError') {
    message    = 'Invalid token. Please log in again.';
    statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    message    = 'Token expired. Please log in again.';
    statusCode = 401;
  }

  // ── MULTER: File too large ───────────────────────────────
  if (err.code === 'LIMIT_FILE_SIZE') {
    message    = 'File too large. Maximum size is 5MB.';
    statusCode = 400;
  }

  // A16: Log safely without blocking sync I/O and without leaking sensitive PII
  if (process.env.NODE_ENV !== 'test') {
    const safeMsg = redactSensitiveData(message);
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Status: ${statusCode} - ${safeMsg}`);
  }

  // Send consistent error response
  res.status(statusCode).json({
    success: false,
    message,
    // In development, also send the stack trace for debugging
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;