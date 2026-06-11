// ============================================================
// controllers/authController.js — AUTH LOGIC (FIXED)
//
// WHAT WAS WRONG:
//   1. register() called sendEmail() but no EMAIL credentials
//      existed in .env → crashed with 403 from email provider
//   2. User model had no isVerified / emailVerificationCode fields
//      so login() always blocked with "Please verify your email"
//   3. Frontend expected { token, user } immediately on register
//      but new flow returned { email, userId } for OTP step
//
// FIX: Removed email verification. Register now works exactly
// like the original — creates user, returns JWT immediately.
// You can add email verification later as a separate feature
// once you have email credentials (SendGrid/Nodemailer) set up.
// ============================================================

const User          = require('../models/User');
const generateToken = require('../utils/generateToken');


// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Create user — password gets hashed in the model's pre-save hook
    const user = await User.create({ name, email, password });

    // Generate JWT token with the new user's _id
    const token = generateToken(user._id);

    // Return token + user immediately (no email verification needed)
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        _id:   user._id,
        name:  user.name,
        email: user.email
      }
    });

  } catch (error) {
    next(error);
  }
};


// @desc    Login user and return JWT
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // .select('+password') because password has select:false in schema
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // bcrypt.compare(entered, hashed) → true or false
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        _id:   user._id,
        name:  user.name,
        email: user.email
      }
    });

  } catch (error) {
    next(error);
  }
};


// @desc    Get currently logged-in user profile
// @route   GET /api/auth/me
// @access  Private (requires JWT)
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      _id:       req.user._id,
      name:      req.user.name,
      email:     req.user.email,
      createdAt: req.user.createdAt
    }
  });
};


// Keep these exports so authRoutes.js doesn't break
// They're registered in the routes file but now do nothing harmful
const verifyEmail = async (req, res) => {
  res.status(200).json({
    success: false,
    message: 'Email verification is disabled. Please log in directly.'
  });
};

const resendVerification = async (req, res) => {
  res.status(200).json({
    success: false,
    message: 'Email verification is disabled.'
  });
};


module.exports = { register, login, verifyEmail, resendVerification, getMe };