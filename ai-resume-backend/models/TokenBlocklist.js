const mongoose = require('mongoose');

const tokenBlocklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '30d' // Matches the 30-day JWT expiry
    }
});

module.exports = mongoose.models.TokenBlocklist || mongoose.model('TokenBlocklist', tokenBlocklistSchema);
