const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // For simplicity in this demo, we might store just the tmdbId or a minimal object. 
    // Spec says "Saves titles to Watchlist...". 
    // Storing { tmdbId, title, poster_path, media_type } is better for listing without fetching details.
    watchlist: [{
        id: Number,
        title: String,
        poster_path: String,
        media_type: String,
        addedAt: { type: Date, default: Date.now }
    }],
    favorites: [{
        id: Number,
        title: String,
        poster_path: String,
        media_type: String,
        addedAt: { type: Date, default: Date.now }
    }],
    watched: [{
        id: Number,
        title: String,
        poster_path: String,
        media_type: String,
        genres: [Number],
        rating: Number,
        watchedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
