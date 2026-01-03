const User = require('../models/User');
const recommendationService = require('../services/recommendationService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: 'User already exists' });

        user = new User({ username, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = { id: user.id };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
        });
    } catch (error) {
        console.error('Register Error:', error.message);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const payload = { id: user.id };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
        });
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ error: 'Server error during login' });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error('GetProfile DB Error:', error.message);
        res.status(500).json({ error: 'Database connection failed' });
    }
};

const addToList = async (req, res) => {
    const { listType } = req.params; // listType: watchlist, favorites, watched
    const movieData = req.body; 

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Check if already in list
        const exists = user[listType].some(m => m.id === movieData.id);
        if (exists) return res.json(user);

        user[listType].push(movieData);
        await user.save();
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update list' });
    }
};

const removeFromList = async (req, res) => {
    const { listType, movieId } = req.params;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Remove movie from list
        user[listType] = user[listType].filter(m => m.id !== parseInt(movieId));
        await user.save();
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to remove from list' });
    }
};

const toggleList = async (req, res) => {
    const { listType } = req.params;
    const movieData = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Check if already in list
        const existingIndex = user[listType].findIndex(m => m.id === movieData.id);
        
        if (existingIndex !== -1) {
            // Remove from list
            user[listType].splice(existingIndex, 1);
        } else {
            // Add to list
            user[listType].push(movieData);
        }

        await user.save();
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to toggle list' });
    }
};

const getRecommendations = async (req, res) => {
    const userId = req.headers['x-user-id'] || req.query.userId;
    if (!userId) return res.status(401).json({ error: 'User ID required' });

    try {
        const recommendations = await recommendationService.getRecommendations(userId);
        res.json(recommendations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
};

const updateProfile = async (req, res) => {
    const { username, email, password, currentPassword } = req.body;
    try {
        if (!currentPassword) {
            return res.status(400).json({ error: 'Current password is required to save changes' });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        if (username) user.username = username;
        if (email) {
            const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
            if (emailExists) return res.status(400).json({ error: 'Email already in use' });
            user.email = email;
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json({ id: user.id, username: user.username, email: user.email });
    } catch (error) {
        console.error('UpdateProfile Error:', error.message);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    addToList,
    removeFromList,
    toggleList,
    getRecommendations,
    updateProfile
};
