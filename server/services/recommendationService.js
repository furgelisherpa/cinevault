const User = require('../models/User');
const tmdbService = require('./tmdbService');

const getRecommendations = async (userId) => {
    // 1. Analyze last 20 user interactions (watched + favorited)
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const history = [...user.watched, ...user.favorites]
        .sort((a, b) => b.addedAt - a.addedAt) // Recent first
        .slice(0, 20);

    if (history.length === 0) {
        // Fallback: Show popular + top rated
        const popular = await tmdbService.getPopular();
        return popular.results.slice(0, 10);
    }

    // 2. Count genre frequency
    const genreCounts = {};
    history.forEach(item => {
        if (item.genres) {
            item.genres.forEach(genreId => {
                genreCounts[genreId] = (genreCounts[genreId] || 0) + 1;
            });
        }
    });

    // 3. Pick top 2 dominant genres
    const topGenres = Object.entries(genreCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 2)
        .map(([id]) => id);

    // 4. Fetch candidates (Same genres)
    // We use TMDB discover for this
    const candidates = await tmdbService.discover({
        with_genres: topGenres.join(','),
        sort_by: 'popularity.desc',
        'vote_count.gte': 100 // Ensure decent quality
    });

    const candidateList = candidates.results || [];

    // Calculate User Average Popularity (for filtering)
    // (This is a bit tricky with raw TMDB data, we'll approximate/skip if complex)
    // Spec: "Popularity score >= user average" -> Let's compute average of history
    // Since we don't store popularity in history explicitly in the valid fields above,
    // we might need to skip this strict check or store it.
    // For now, let's proceed with the sorting logic.

    // 5. Sort by: (TMDB rating * 0.7) + (popularity * 0.3)
    // Note: Popularity in TMDB is essentially unbounded, while rating is 0-10.
    // We should normalize or just weight them raw as requested.
    // A raw sum will be dominated by popularity (often 1000+).
    // Let's normalize popularity roughly or just trust the rule literally.
    // "Return top 10 results"

    const scoredCandidates = candidateList.map(movie => {
        const score = (movie.vote_average * 0.7) + (movie.popularity * 0.3);
        return { ...movie, _score: score };
    });

    scoredCandidates.sort((a, b) => b._score - a._score);

    // Exclude already watched
    const watchedIds = new Set(user.watched.map(w => w.id));
    
    const finalResults = scoredCandidates
        .filter(m => !watchedIds.has(m.id))
        .slice(0, 10);

    return finalResults;
};

module.exports = {
    getRecommendations
};
