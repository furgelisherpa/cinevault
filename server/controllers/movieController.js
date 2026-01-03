const mongoose = require('mongoose');
const tmdbService = require('../services/tmdbService');
const cache = require('../services/cacheService');
const MovieCache = require('../models/MovieCache');

// Helper for memory caching (Trending, Popular, etc.)
const getOrFetch = async (key, fetchFn, ttl = 21600) => {
    const cachedData = cache.get(key);
    if (cachedData) {
        console.log(`[Cache Hit] Memory: ${key}`);
        return cachedData;
    }

    console.log(`[Cache Miss] Fetching: ${key}`);
    const data = await fetchFn();
    cache.set(key, data, ttl);
    return data;
};

const getTrending = async (req, res) => {
    const { page } = req.query;
    try {
        const data = await getOrFetch(`trending_movie_day_${page || 1}`, () => tmdbService.getTrending('movie', 'day', page));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch trending movies' });
    }
};

const getPopular = async (req, res) => {
    const { page } = req.query;
    try {
        const data = await getOrFetch(`popular_movie_${page || 1}`, () => tmdbService.getPopular('movie', page));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch popular movies' });
    }
};

const getTopRated = async (req, res) => {
    const { page } = req.query;
    try {
        const data = await getOrFetch(`top_rated_movie_${page || 1}`, () => tmdbService.getTopRated('movie', page));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch top rated movies' });
    }
};

const getUpcoming = async (req, res) => {
    const { page } = req.query;
    try {
        const data = await getOrFetch(`upcoming_movie_${page || 1}`, () => tmdbService.getUpcoming(page));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch upcoming movies' });
    }
};

const getDetails = async (req, res) => {
    const { id } = req.params;
    
    if (!id || id === 'undefined') {
        return res.status(400).json({ error: 'Valid Movie ID required' });
    }

    const cacheKey = `movie_${id}`;

    try {
        // 1. Check Memory Cache (Fastest)
        const memCached = cache.get(cacheKey);
        if (memCached) {
            console.log(`[Cache Hit] Memory: ${cacheKey}`);
            return res.json(memCached);
        }

        // 2. Check MongoDB Cache (Persistent - 24h)
        try {
            if (mongoose.connection.readyState === 1) {
                const dbCached = await MovieCache.findOne({ id: id });
                if (dbCached) {
                    console.log(`[Cache Hit] DB: ${cacheKey}`);
                    cache.set(cacheKey, dbCached.data, 3600); 
                    return res.json(dbCached.data);
                }
            }
        } catch (dbError) {
            console.error('MongoDB Error (findOne):', dbError.message);
        }

        // 3. Fetch from TMDB
        console.log(`[Cache Miss] Fetching Details: ${id}`);
        let data;
        try {
            data = await tmdbService.getDetails(id, 'movie'); 
        } catch (tmdbErr) {
            if (tmdbErr.response?.status === 404) {
                return res.status(404).json({ error: 'Movie not found in TMDB' });
            }
            throw tmdbErr;
        }

        // 4. Save to DB (Fire and forget)
        if (mongoose.connection.readyState === 1) {
            MovieCache.create({
                id: id,
                mediaType: 'movie',
                data: data
            }).catch(err => console.error('MongoDB Error (create):', err.message));
        }

        // 5. Save to Memory
        cache.set(cacheKey, data, 3600);

        res.json(data);
    } catch (error) {
        console.error('TMDB Fetch Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch movie details' });
    }
};

const search = async (req, res) => {
    const { q, ...filters } = req.query;
    // Search is less likely to be effectively cached unless frequent terms, 
    // but we can cache identical queries briefly.
    const cacheKey = `search_${q}_${JSON.stringify(filters)}`;
    
    try {
        const fetchFn = q 
            ? () => tmdbService.search(q, filters)
            : () => {
                const searchParams = { ...filters };
                // If with_genres but no q, we use discover
                console.log(`[Discover Request] Genre/Filters:`, searchParams);
                return tmdbService.discover(searchParams);
            };
            
        const result = await getOrFetch(cacheKey, fetchFn, 300); // 5 min cache
        const count = result.results ? result.results.length : 0;
        console.log(`[Search/Discover Success] Key: ${cacheKey}, Results count:`, count);
        res.json(result);
    } catch (error) {
        console.error('Search/Discover failed:', error.message);
        res.status(500).json({ error: 'Search or Discover failed' });
    }
};

const getRecommendations = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await tmdbService.getDetails(id, 'movie');
        // Return in the same format as other endpoints
        res.json({ results: data.recommendations?.results || [] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
};

const getTVShows = async (req, res) => {
    const { page, with_genres } = req.query;
    try {
        const data = await getOrFetch(`tv_popular_${page || 1}_${with_genres || ''}`, () => 
            tmdbService.discover({ media_type: 'tv', page, with_genres })
        );
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch TV shows' });
    }
};

const getMovies = async (req, res) => {
    const { page, with_genres } = req.query;
    try {
        const data = await getOrFetch(`movie_discover_${page || 1}_${with_genres || ''}`, () => 
            tmdbService.discover({ page, with_genres })
        );
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
};

module.exports = {
    getTrending,
    getPopular,
    getTopRated,
    getUpcoming,
    getDetails,
    search,
    getRecommendations,
    getTVShows,
    getMovies
};
