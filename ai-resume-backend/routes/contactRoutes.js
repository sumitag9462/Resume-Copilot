const express = require('express');
const rateLimit = require('express-rate-limit');
const { submitQuery } = require('../controllers/contactController');

const router = express.Router();

// A39: Dedicated abuse throttling limiter for contact inquiries
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 submissions per 15 minutes
  message: { success: false, message: 'Too many contact requests from this IP. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test'
});

router.post('/submit', contactLimiter, submitQuery);

module.exports = router;
