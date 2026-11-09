const mongoose = require('mongoose');

const tokenBlocklistSchema = new mongoose.Schema({
    tokenHash: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    // Optional legacy field to prevent breaks if old tests/data exist
    token: {
        type: String,
        index: true,
        sparse: true
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0 // Automatically deletes the document once expiresAt is reached
    }
}, { timestamps: true });

module.exports = mongoose.models.TokenBlocklist || mongoose.model('TokenBlocklist', tokenBlocklistSchema);
