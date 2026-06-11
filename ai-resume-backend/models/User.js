// ============================================================
// models/User.js — USER SCHEMA
//
// A Mongoose "Schema" defines the shape of documents in MongoDB.
// mongoose.model('User', userSchema) creates the "users" collection.
//
// KEY CONCEPTS:
//   - `select: false` on password → password is never returned in
//     queries unless you explicitly add .select('+password')
//   - `pre('save')` hook → runs BEFORE saving to DB. We use it to
//     hash the password automatically. bcrypt is a one-way hash,
//     meaning you cannot reverse it to get the original password.
//   - `comparePassword` method → used in login to check if the
//     entered password matches the stored hash.
// ============================================================

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Please provide your name'],
      trim:     true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type:     String,
      required: [true, 'Please provide an email'],
      unique:   true,        // MongoDB creates a unique index on this field
      lowercase: true,       // Always store email in lowercase
      trim:     true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type:      String,
      required:  [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select:    false        // NEVER include in query results by default
    },
    isVerified: {
      type:    Boolean,
      default: false
    },
    emailVerificationCode: {
      type:   String,
      select: false
    },
    emailVerificationExpires: Date
  },
  {
    timestamps: true  // Automatically adds createdAt and updatedAt fields
  }
);

// ── PRE-SAVE HOOK ───────────────────────────────────────────
// Runs automatically before every .save() call.
// `this.isModified('password')` prevents re-hashing an already hashed
// password when updating other fields (like name or email).
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  // Salt rounds = 12 means bcrypt runs 2^12 = 4096 iterations
  // Higher = more secure but slower. 12 is the industry standard.
  this.password = await bcrypt.hash(this.password, 12);
});

// ── INSTANCE METHOD ─────────────────────────────────────────
// Added to every User document. Called in authController during login.
// bcrypt.compare() hashes the candidate and compares with stored hash.
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);