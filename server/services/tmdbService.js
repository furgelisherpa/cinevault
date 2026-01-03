const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

const tmdbClient = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
        api_key: API_KEY,
        language: 'en-US'
    }
});

// Helper to handle errors or missing key
const handleRequest = async (request) => {
    if (!API_KEY) {
        console.warn('No TMDB API Key found. Returning mock data.');
        const mock = require('../mockData');
        return { ...mock, page: 1, total_pages: 1 };
    }
    try {
        const response = await request;
        console.log(`[TMDB Success] URL: ${response.config.url}, Method: ${response.config.method}, Results:`, response.data.results?.length);
        return response.data;
    } catch (error) {
        console.error('TMDB API Error:', error.response?.status, error.response?.data || error.message);
        throw error;
    }
};

const getTrending = (mediaType = 'movie', timeWindow = 'day', page = 1) => {
    return handleRequest(tmdbClient.get(`trending/${mediaType}/${timeWindow}`, { params: { page } }));
};

const getPopular = (mediaType = 'movie', page = 1) => {
    return handleRequest(tmdbClient.get(`${mediaType}/popular`, { params: { page } }));
};

const getTopRated = (mediaType = 'movie', page = 1) => {
    return handleRequest(tmdbClient.get(`${mediaType}/top_rated`, { params: { page } }));
};

const getUpcoming = (page = 1) => {
    return handleRequest(tmdbClient.get(`movie/upcoming`, { params: { page } }));
};

const getDetails = (id, mediaType = 'movie') => {
    return handleRequest(tmdbClient.get(`${mediaType}/${id}`, {
        params: {
            append_to_response: 'credits,videos,recommendations,similar'
        }
    }));
};

const search = (query, filters = {}) => {
    // Basic search, filters logic will need to be applied manually or via discover endpoint
    return handleRequest(tmdbClient.get(`search/multi`, {
        params: {
            query,
            ...filters
        }
    }));
};

const discover = (params) => {
    console.log(`[TMDB Discover] Calling with params:`, params);
    // Standardize with_genres to be string for TMDB compatibility
    const processedParams = { ...params };
    if (processedParams.with_genres) {
        processedParams.with_genres = String(processedParams.with_genres);
    }

    return handleRequest(tmdbClient.get(`discover/movie`, { 
        params: {
            sort_by: 'popularity.desc',
            include_adult: false,
            ...processedParams 
        } 
    }));
};

module.exports = {
    getTrending,
    getPopular,
    getTopRated,
    getUpcoming,
    getDetails,
    search,
    discover
};
