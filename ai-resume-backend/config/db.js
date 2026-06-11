// ============================================================
// config/db.js — DATABASE CONNECTION
//
// mongoose.connect() does the handshake with MongoDB Atlas.
// We call this once at startup (in server.js).
// If connection fails → process.exit(1) shuts the server down
// so we know immediately something is wrong.
// ============================================================

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1); // Exit with failure code
  }
};

module.exports = connectDB;