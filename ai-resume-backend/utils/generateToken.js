// ============================================================
// utils/generateToken.js — JWT TOKEN GENERATOR
//
// JWT = JSON Web Token. Think of it like a digital ID card:
//   - Issued by the server after successful login
//   - Client stores it and sends it with every protected request
//   - Server verifies it without checking the database every time
//
// Structure of a JWT: header.payload.signature
//   - header:    algorithm used (HS256)
//   - payload:   data we stored (userId)
//   - signature: HMAC hash of header+payload using JWT_SECRET
//
// jwt.sign(payload, secret, options) creates the token.
// jwt.verify(token, secret) decodes and verifies it.
//
// NEVER store sensitive data (passwords) in JWT payload.
// Anyone can decode it, but only the server can VERIFY it.
// ============================================================

const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },                                // Payload: what we embed in the token
    process.env.JWT_SECRET,                        // Secret key used to sign the token
    { expiresIn: process.env.JWT_EXPIRE || '7d' }  // Token expires in 7 days
  );
};

module.exports = generateToken;