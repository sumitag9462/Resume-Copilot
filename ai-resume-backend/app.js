// app.js — Express app setup for tests and server startup
const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const path    = require('path');
const helmet  = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const authRoutes            = require('./routes/authRoutes');
const resumeRoutes          = require('./routes/resumeRoutes');
const analysisRoutes        = require('./routes/analysisRoutes');
const bulletEnhancerRoutes  = require('./routes/bulletEnhancerRoutes');
const interviewRoutes       = require('./routes/interviewPrepRoutes');
const weakLanguageRoutes    = require('./routes/weakLanguageRoutes');
const arenaRoutes           = require('./routes/arenaRoutes');
const outreachRoutes        = require('./routes/outreachRoutes');
const errorHandler          = require('./middleware/errorHandler');

const app = express();

// Trust proxy for rate limiter behind reverse proxies (Render)
app.set('trust proxy', 1);

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
  "https://resume-copilot-beta.vercel.app",
  "https://resume-copilot-1.onrender.com"
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow if in allowedOrigins list or if it's a vercel domain
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
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
});
app.use('/api/', apiLimiter);

app.use(express.json({ limit: '10kb' })); // Limit body size to prevent payload attacks
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// NoSQL Injection Protection is handled by Mongoose schema casting natively
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',            authRoutes);
app.use('/api/resume',          resumeRoutes);
app.use('/api/analysis',        analysisRoutes);
app.use('/api/bullets',         bulletEnhancerRoutes);
app.use('/api/interview',       interviewRoutes);
app.use('/api/weak-language',   weakLanguageRoutes);
app.use('/api/arena',           arenaRoutes);
app.use('/api/outreach',        outreachRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Resume Copilot API is running' });
});

app.use(errorHandler);

module.exports = app;
