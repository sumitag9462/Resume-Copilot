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

const connectDB = require('./config/db');
const app       = require('./app');

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});