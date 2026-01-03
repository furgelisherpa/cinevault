const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// Specific routes MUST come before parameterized routes
router.get('/trending', movieController.getTrending);
router.get('/popular', movieController.getPopular);
router.get('/top-rated', movieController.getTopRated);
router.get('/upcoming', movieController.getUpcoming);
router.get('/tv-shows', movieController.getTVShows);
router.get('/movies', movieController.getMovies);

// Search route (with query params)
router.get('/', movieController.search); 

// Parameterized routes MUST come last
router.get('/:id/recommendations', movieController.getRecommendations);
router.get('/:id', movieController.getDetails);

module.exports = router;
