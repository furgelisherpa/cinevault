const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.post('/:listType', auth, userController.addToList); // /watchlist, etc.
router.delete('/:listType/:movieId', auth, userController.removeFromList);
router.put('/:listType/toggle', auth, userController.toggleList);

module.exports = router;
