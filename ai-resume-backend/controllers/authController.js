const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');
const OTP = require('../models/OTP');
const TokenBlocklist = require('../models/TokenBlocklist');

const generateToken = (userId, name) => {
    return jwt.sign({ userId, name }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Nodemailer SMTP Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
    },
    connectionTimeout: 5000, // 5 seconds
    greetingTimeout: 5000,
    socketTimeout: 5000,
});

// Helper: Sends email OTP, or prints to terminal if SMTP not configured
const sendOtpEmail = async (email, otp, subject, title) => {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
            await transporter.sendMail({
                from: `YourAppName <${process.env.EMAIL_USER}>`,
                to: email,
                subject: subject,
                html: `<div style="font-family:sans-serif;text-align:center;padding:20px">
                         <h2>${title}</h2>
                         <p>Your one-time password is:</p>
                         <p style="font-size:24px;font-weight:bold;letter-spacing:5px;margin:20px 0;background:#f0f0f0;padding:10px;border-radius:5px">${otp}</p>
                         <p>This code will expire in 5 minutes.</p>
                       </div>`,
            });
            return true;
        } catch (mailError) {
            console.error('SMTP Mail error, printing OTP to terminal:', mailError.message);
        }
    }
    // Fallback console log for local development
    console.log(`\n==================================================\n⚠️  EMAIL NOT SENT! DEV OTP for ${email}: ${otp}\n==================================================\n`);
    return false;
};

// 1. Request Registration OTP
const requestEmailOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required.' });

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User with this email already exists.' });

        const otp = crypto.randomInt(100000, 999999).toString();
        await OTP.create({ email, otp });
        await sendOtpEmail(email, otp, 'Your Verification Code', 'Verification Code');

        res.status(200).json({ message: 'Verification code generated.' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Error sending verification code.' });
    }
};

// 2. Verify OTP and Register Account
const verifyEmailOtp = async (req, res) => {
    try {
        const { name, email, password, mobile, place, otp } = req.body;
        if (!password || password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
        }

        // Verify latest OTP
        const otpRecord = await OTP.findOne({ email, otp }).sort({ createdAt: -1 });
        if (!otpRecord) return res.status(400).json({ message: 'Invalid or expired verification code.' });

        // Save User
        const newUser = await User.create({ name, email, password, mobile, place });
        await OTP.deleteMany({ email }); // Delete verified OTPs

        res.status(201).json({ success: true, message: 'Registration successful! Please log in.' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// 3. User Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id, user.name);
            res.json({
                success: true,
                token,
                user: { id: user._id, name: user.name, email: user.email, photo: user.photo || '' },
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

// 4. Request Password Reset OTP
const requestPasswordResetOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        // Security best practice: don't reveal if user doesn't exist
        if (!user) return res.status(200).json({ message: 'If an account with this email exists, a verification code has been sent.' });

        const otp = crypto.randomInt(100000, 999999).toString();
        await OTP.create({ email, otp });
        await sendOtpEmail(email, otp, 'Your Password Reset Code', 'Password Reset');

        res.status(200).json({ message: 'A verification code has been generated.' });
    } catch (error) {
        console.error('Password reset OTP error:', error);
        res.status(500).json({ message: 'Error sending verification code.' });
    }
};

// 5. Verify Password Reset OTP
const verifyPasswordResetOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpRecord = await OTP.findOne({ email, otp }).sort({ createdAt: -1 });
        if (!otpRecord) return res.status(400).json({ message: 'Invalid or expired verification code.' });

        const user = await User.findOne({ email });
        // Generate a short-lived token valid for password reset (10 minutes)
        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
        
        await OTP.deleteMany({ email });
        res.status(200).json({ success: true, resetToken });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ message: 'Server error during OTP verification.' });
    }
};

// 6. Reset Password
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) return res.status(400).json({ message: 'Missing information.' });
        if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters long.' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        user.password = password;
        await user.save(); // pre-save hook hashes it automatically
        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(400).json({ message: 'Invalid or expired token.' });
    }
};

// 7. Logout User (Blocklists current token)
const logoutUser = async (req, res) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (token) {
            await TokenBlocklist.create({ token });
        }
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error during logout' });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    requestEmailOtp,
    verifyEmailOtp,
    loginUser,
    logoutUser,
    requestPasswordResetOtp,
    verifyPasswordResetOtp,
    resetPassword,
    getProfile
};