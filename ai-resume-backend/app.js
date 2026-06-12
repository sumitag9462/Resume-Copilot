// app.js — Express app setup for tests and server startup
const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const path    = require('path');

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

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
  res.json({ message: '✅ Resume Copilot API is running!' });
});

app.use(errorHandler);

module.exports = app;
