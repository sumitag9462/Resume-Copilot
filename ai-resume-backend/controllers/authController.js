const jwt = require('jsonwebtoken');
const axios = require('axios');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const OTP = require('../models/OTP');
const TokenBlocklist = require('../models/TokenBlocklist');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId, name) => {
    return jwt.sign({ userId, name }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Helper: Sends email OTP using Brevo API, or prints to terminal if not configured/failed
const sendOtpEmail = async (email, otp, subject, title) => {
    if (process.env.BREVO_API_KEY) {
        try {
            await axios.post(
                'https://api.brevo.com/v3/smtp/email',
                {
                    sender: {
                        name: 'Resume Copilot',
                        email: process.env.EMAIL_FROM || 'agrawalsumit067@gmail.com'
                    },
                    to: [{ email: email }],
                    subject: subject,
                    htmlContent: `<div style="font-family:sans-serif;text-align:center;padding:20px">
                             <h2>${title}</h2>
                             <p>Your one-time password is:</p>
                             <p style="font-size:24px;font-weight:bold;letter-spacing:5px;margin:20px 0;background:#f0f0f0;padding:10px;border-radius:5px">${otp}</p>
                             <p>This code will expire in 5 minutes.</p>
                           </div>`
                },
                {
                    headers: {
                        'api-key': process.env.BREVO_API_KEY,
                        'Content-Type': 'application/json',
                        'accept': 'application/json'
                    },
                    timeout: 4000
                }
            );
            return true;
        } catch (mailError) {
            console.error('Brevo API error, falling back to nodemailer:', mailError.response?.data || mailError.message);
        }
    }
    
    // Fallback to Nodemailer if Brevo is not configured or failed
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                port: process.env.EMAIL_PORT || 465,
                secure: process.env.EMAIL_SECURE === 'true',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                },
                connectionTimeout: 4000,
                greetingTimeout: 4000,
                socketTimeout: 4000
            });

            await transporter.sendMail({
                from: `"Resume Copilot" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: subject,
                html: `<div style="font-family:sans-serif;text-align:center;padding:20px">
                         <h2>${title}</h2>
                         <p>Your one-time password is:</p>
                         <p style="font-size:24px;font-weight:bold;letter-spacing:5px;margin:20px 0;background:#f0f0f0;padding:10px;border-radius:5px">${otp}</p>
                         <p>This code will expire in 5 minutes.</p>
                       </div>`
            });
            return true;
        } catch (mailError) {
            console.error('Nodemailer error, printing OTP to terminal:', mailError.message);
        }
    }

    // Fallback console log for local development or if email fails
    console.log(`\n==================================================\n⚠️  EMAIL NOT SENT! DEV OTP for ${email}: ${otp}\n==================================================\n`);
    return false;
};

// 1. Direct Registration (or OTP request if only email provided)
const registerUser = async (req, res) => {
    try {
        const { name, email, password, mobile, place, careerStage, experience, desiredRole, skills } = req.body;

        // Backward compatibility / test fallback: if only email is provided
        if (email && !password && !name) {
            return requestEmailOtp(req, res);
        }

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }

        if (!password || password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
        }

        if (!name || name.trim() === '') {
            return res.status(400).json({ success: false, message: 'Name is required.' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
        }

        const newUser = await User.create({
            name: name.trim(),
            email,
            password,
            mobile: mobile || '0000000000',
            place: place || 'Remote',
            careerStage: careerStage || '',
            experience: experience || '',
            desiredRole: desiredRole || '',
            skills: skills || ''
        });

        const token = generateToken(newUser._id, newUser.name);

        res.status(201).json({
            success: true,
            message: 'Registration successful! Loading workspace...',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                photo: newUser.photo || ''
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
};

// 1. Request Registration OTP
const requestEmailOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ success: false, message: 'An account with this email already exists.' });

        const otp = crypto.randomInt(100000, 999999).toString();
        await OTP.create({ email, otp });
        await sendOtpEmail(email, otp, 'Your Verification Code', 'Verification Code');

        res.status(200).json({ success: true, message: 'Verification code generated.' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, message: 'Error sending verification code.' });
    }
};

    const verifyEmailOtp = async (req, res) => {
    try {
        const { name, email, password, mobile, place, careerStage, experience, desiredRole, skills, otp } = req.body;
        if (!password || password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
        }

        // Verify latest OTP
        const otpRecord = await OTP.findOne({ email, otp }).sort({ createdAt: -1 });
        if (!otpRecord) return res.status(400).json({ message: 'Invalid or expired verification code.' });

        // Save User
        const newUser = await User.create({ name, email, password, mobile, place, careerStage, experience, desiredRole, skills });
        await OTP.deleteMany({ email }); // Delete verified OTPs

        const token = generateToken(newUser._id, newUser.name);

        res.status(201).json({ 
            success: true, 
            message: 'Registration successful! Loading workspace...',
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email, photo: newUser.photo || '' }
        });
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

        res.status(200).json({ message: 'If an account with this email exists, a verification code has been sent.' });
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

const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ success: false, message: 'Google credential is required' });
        }
        
        let email, name, picture;

        // Check if credential is a JWT ID token (starts with ey)
        if (typeof credential === 'string' && credential.startsWith('ey')) {
            try {
                const ticket = await googleClient.verifyIdToken({
                    idToken: credential,
                    audience: process.env.GOOGLE_CLIENT_ID
                });
                const payload = ticket.getPayload();
                email = payload.email;
                name = payload.name || payload.email.split('@')[0];
                picture = payload.picture;
            } catch (jwtErr) {
                console.warn('Google ID token verification failed, trying userinfo endpoint:', jwtErr.message);
            }
        }

        // If not retrieved via ID token, fetch using Google userinfo API with OAuth access token
        if (!email) {
            const googleRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${credential}` },
                timeout: 8000
            });
            email = googleRes.data.email;
            name = googleRes.data.name || email.split('@')[0];
            picture = googleRes.data.picture;
        }

        if (!email) {
            return res.status(400).json({ success: false, message: 'Could not retrieve email from Google' });
        }

        let user = await User.findOne({ email });
        
        if (!user) {
            // Register new user
            const randomPassword = crypto.randomBytes(16).toString('hex');
            user = await User.create({
                name,
                email,
                password: randomPassword,
                photo: picture || '',
                place: 'Remote',
                mobile: '0000000000',
            });
        } else if (!user.photo && picture) {
            user.photo = picture;
            await user.save();
        }

        const token = generateToken(user._id, user.name);
        res.status(200).json({
            success: true,
            message: 'Logged in successfully with Google!',
            token,
            user: { id: user._id, name: user.name, email: user.email, photo: user.photo || '' }
        });
    } catch (error) {
        console.error('Google login error:', error.response?.data || error.message);
        res.status(401).json({ success: false, message: 'Google authentication failed' });
    }
};

module.exports = {
    registerUser,
    requestEmailOtp,
    verifyEmailOtp,
    loginUser,
    googleLogin,
    logoutUser,
    requestPasswordResetOtp,
    verifyPasswordResetOtp,
    resetPassword,
    getProfile
};