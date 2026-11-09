// app.js — Express app setup for tests and server startup
const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const path    = require('path');
const helmet  = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

dotenv.config();

const authRoutes            = require('./routes/authRoutes');
const resumeRoutes          = require('./routes/resumeRoutes');
const analysisRoutes        = require('./routes/analysisRoutes');
const bulletEnhancerRoutes  = require('./routes/bulletEnhancerRoutes');
const interviewRoutes       = require('./routes/interviewPrepRoutes');
const weakLanguageRoutes    = require('./routes/weakLanguageRoutes');
const arenaRoutes           = require('./routes/arenaRoutes');
const outreachRoutes        = require('./routes/outreachRoutes');
const userRoutes            = require('./routes/userRoutes');
const contactRoutes         = require('./routes/contactRoutes');

const copilotRoutes         = require('./routes/copilotRoutes');
const errorHandler          = require('./middleware/errorHandler');

const app = express();

// Trust proxy for rate limiter behind reverse proxies (Render)
app.set('trust proxy', 1);

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5001",
  "http://127.0.0.1:5001",
  "http://localhost:3000",
  process.env.CLIENT_URL,
  "https://resume-copilot-beta.vercel.app",
  "https://resume-copilot-1.onrender.com"
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Not allowed by CORS origin whitelist'));
    }
  },
  credentials: true
}));

// Security Headers
app.use(helmet({ crossOriginResourcePolicy: false })); // false allows serving local images

// Rate Limiting (100 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test'
});
app.use('/api/', apiLimiter);

app.use(express.json({ limit: '250kb' }));
app.use(express.urlencoded({ extended: true, limit: '250kb' }));

// A02: Direct access to uploads directory is forbidden — use GET /api/resume/:id/file
app.use('/uploads', (req, res) => {
  res.status(403).json({ success: false, message: 'Direct access to uploaded files is forbidden' });
});

app.use('/api/auth',            authRoutes);
app.use('/api/resume',          resumeRoutes);
app.use('/api/analysis',        analysisRoutes);
app.use('/api/bullets',         bulletEnhancerRoutes);
app.use('/api/interview',       interviewRoutes);
app.use('/api/weak-language',   weakLanguageRoutes);
app.use('/api/arena',           arenaRoutes);
app.use('/api/outreach',        outreachRoutes);
app.use('/api/user',            userRoutes);
app.use('/api/contact',         contactRoutes);
app.use('/api/copilot',         copilotRoutes);

// A32 & A36: Truthful health and readiness probes
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: 'ok',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    services: {
      database: isDbConnected ? 'connected' : 'disconnected',
      ai: process.env.GEMINI_API_KEY ? 'configured' : 'missing'
    }
  });
});

app.get('/api/readiness', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  if (!isDbConnected) {
    return res.status(503).json({ ready: false, reason: 'Database disconnected' });
  }
  res.status(200).json({ ready: true, services: { database: 'connected' } });
});

app.get('/', (req, res) => {
  res.json({ message: 'Resume Copilot API is running' });
});

app.use(errorHandler);

module.exports = app;
