// ============================================================
// middleware/authMiddleware.js — JWT AUTHENTICATION GUARD
//
// Middleware = a function that runs BETWEEN the request arriving
// and the controller handling it. It has access to (req, res, next).
// Calling next() passes control to the next middleware/controller.
// Calling res.json() ends the request right there.
//
// How it works:
//   1. Frontend sends:  Authorization: Bearer <jwt_token>
//   2. We extract the token from that header
//   3. jwt.verify() checks the signature + expiry
//   4. We decode the userId from the token payload
//   5. We fetch the full user from MongoDB
//   6. We attach user to req.user so controllers can use it
//
// FIX 1: Split into two separate try-catch blocks.
//   Before, jwt.verify() AND User.findById() were in the same
//   try-catch. If MongoDB crashed, the user saw "Token is invalid"
//   which is the wrong error message. Now each failure gives the
//   correct message.
//
// FIX 2: Added .select('-password') to User.findById().
//   The password field has select:false in the schema, but being
//   explicit here is safer and more readable.
//
// Usage in routes: router.get('/me', protect, getMe)
// The `protect` runs first, then `getMe` only if token is valid.
// ============================================================

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // ── STEP 1: Check Authorization header exists ─────────────────
  // Header format:  Authorization: Bearer eyJhbGci...
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // "Bearer eyJhbGci..." → split on space → take index [1]
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token found at all, block immediately
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. No token provided.'
    });
  }

  // ── STEP 2: Verify the JWT signature and expiry ───────────────
  // FIX: Separate try-catch so JWT errors give correct message.
  // jwt.verify() throws if token is expired or tampered with.
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { id: "64abc123...", iat: 1234567890, exp: 1234567890 }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token is invalid or has expired. Please log in again.'
    });
  }

  // ── STEP 3: Fetch user from MongoDB ───────────────────────────
  // FIX: Separate from JWT verification. If DB crashes here, it
  // will be caught by the global error handler in server.js, not
  // confused with a JWT error.
  // .select('-password') explicitly excludes password from result.
  req.user = await User.findById(decoded.id).select('-password');

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User belonging to this token no longer exists.'
    });
  }

  // ── STEP 4: All good → pass control to the next function ──────
  next();
};

module.exports = { protect };