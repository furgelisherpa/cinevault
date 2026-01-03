const mongoose = require('mongoose');

const movieCacheSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    mediaType: {
        type: String,
        enum: ['movie', 'tv'],
        default: 'movie'
    },
    data: {
        type: Object, // Store the full/normalized JSON response
        required: true
    },
    cachedAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // 24 hours in seconds
    }
}, { timestamps: true });

module.exports = mongoose.model('MovieCache', movieCacheSchema);
