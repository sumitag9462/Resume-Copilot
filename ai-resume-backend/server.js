// ============================================================
// server.js — ENTRY POINT
// ============================================================

const dotenv = require('dotenv');
const mongoose = require('mongoose');

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
if (!process.env.BREVO_API_KEY) {
  console.warn('\n⚠️  STARTUP WARNING: BREVO_API_KEY is not configured.');
  console.warn('   OTP emails will not be sent via Brevo; OTP codes will fall back to stdout/terminal logs only.\n');
}

const connectDB = require('./config/db');
const app       = require('./app');

const PORT = process.env.PORT || 5000;

let server;

// A36: Await database readiness before announcing/serving API readiness
const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    const handleShutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Gracefully shutting down...`);
      if (server) {
        server.close(async () => {
          console.log('HTTP server closed.');
          try {
            await mongoose.connection.close();
            console.log('MongoDB connection closed.');
            process.exit(0);
          } catch (err) {
            console.error('Error closing MongoDB connection:', err);
            process.exit(1);
          }
        });

        // Force shutdown after 10s if graceful close hangs
        setTimeout(() => {
          console.error('Forced exit after timeout.');
          process.exit(1);
        }, 10000).unref();
      } else {
        process.exit(0);
      }
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));

    return server;
  } catch (err) {
    console.error('Server startup failed:', err.message);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = { startServer };
