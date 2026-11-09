const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    email:     { type: String, required: true, lowercase: true, trim: true, index: true },
    otpHash:   { type: String, required: true },
    purpose:   { 
        type: String, 
        required: true, 
        enum: ['signup', 'password_reset', 'email_verification'],
        default: 'signup',
        index: true
    },
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    attempts:  { type: Number, default: 0 },
    consumed:  { type: Boolean, default: false, index: true },
    consumedAt: { type: Date, default: null },
    expiresAt: { type: Date, required: true, index: true },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600 // Auto-cleans expired documents after 1 hour (as safety backstop)
    }
});

// Compound index for fast queries
OTPSchema.index({ email: 1, purpose: 1, consumed: 1, expiresAt: 1 });

module.exports = mongoose.models.OTP || mongoose.model('OTP', OTPSchema);
