// ============================================================
// server.js — ENTRY POINT
// This is the first file Node.js runs. It:
//   1. Loads all environment variables from .env
//   2. Connects to MongoDB
//   3. Creates the Express app
//   4. Registers all middleware and routes
//   5. Starts listening on a port
// ============================================================

const dotenv = require('dotenv');

dotenv.config();

// Ensure critical environment variables are present
const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'GEMINI_API_KEY'];
const missingEnv = requiredEnv.filter(env => !process.env[env]);

if (missingEnv.length > 0) {
  console.error(`\n❌ CRITICAL STARTUP ERROR: Missing required environment variables:\n   ${missingEnv.join(', ')}\n`);
  console.error('Please verify that these are set in your .env file or host environment settings.');
  process.exit(1);
}

// Warn about missing but optional email config
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('\n⚠️  STARTUP WARNING: EMAIL_USER and/or EMAIL_PASS are not configured.');
  console.warn('   Nodemailer emails will not be sent; OTP codes will fall back to stdout/terminal logs only.\n');
}

const connectDB = require('./config/db');
const app       = require('./app');

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});