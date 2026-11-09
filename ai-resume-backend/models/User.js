const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    mobile:   { type: String },
    place:    { type: String },
    photo:    { type: String, default: '' },
    careerStage: { type: String },
    experience:  { type: String },
    desiredRole: { type: String },
    skills:      { type: String },
    isVerified:  { type: Boolean, default: false },
    googleId:    { type: String, sparse: true, index: true },
    resetPasswordJti:     { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    passwordChangedAt:    { type: Date, default: null },
    tokenVersion:         { type: Number, default: 0 },
    settings: {
        ai: {
            coverTone:      { type: String, default: 'professional' },
            atsKeywords:    { type: String, default: 'balanced' },
            autoSuggest:    { type: Boolean, default: true },
            showConfidence: { type: Boolean, default: true },
            strictAts:      { type: Boolean, default: false }
        },
        notifications: {
            atsComplete:  { type: Boolean, default: true },
            matchAlerts:  { type: Boolean, default: true },
            coverReady:   { type: Boolean, default: true },
            weeklyDigest: { type: Boolean, default: false }
        }
    }
}, { timestamps: true });

// Method to verify password match
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Auto-hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);