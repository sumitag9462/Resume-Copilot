// ============================================================
// config/db.js — DATABASE CONNECTION
//
// mongoose.connect() does the handshake with MongoDB Atlas.
// We call this once at startup (in server.js).
// ============================================================

const dns = require('dns');
const mongoose = require('mongoose');

// A37: Do not unconditionally override host system DNS resolvers.
// Respect host/VPC DNS unless explicitly configured via CUSTOM_DNS_SERVERS.
if (process.env.CUSTOM_DNS_SERVERS) {
  try {
    const servers = process.env.CUSTOM_DNS_SERVERS.split(',').map(s => s.trim()).filter(Boolean);
    if (servers.length > 0) {
      dns.setServers(servers);
    }
  } catch (err) {
    console.warn('⚠️ Failed to set custom DNS servers:', err.message);
  }
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    if (process.env.NODE_ENV !== 'test') {
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    }
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1); // Exit with failure code in standalone server mode
    }
    throw error;
  }
};

module.exports = connectDB;
