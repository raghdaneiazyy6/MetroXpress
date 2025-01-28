// Import required dependencies
const express = require('express');
const router = express.Router();
// Import User model for accessing user data
const { User } = require('../models/User');
// Import RFIDcard model for accessing card data
const { RFIDcard } = require('../models/RFIDCard');
const jwt = require('jsonwebtoken');

/**
 * @desc Get user profile information
 * @route GET /profile
 * @access Private
 */
router.get('/profile', async (req, res) => {
    try {
        // Get user ID from JWT token
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;

        // Find specific user by ID
        const user = await User.findById(userId).select('fullName email');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @desc Get all RFID cards associated with user
 * @route GET /profile/cards
 * @access Public
 */
router.get('/profile/cards', async (req, res) => {
    try {
        // Since there's no auth, we need to get userId from query params or similar
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        
        const cards = await RFIDcard.find({ userId }).select('cardId balance status issueDate expiryDate lastUsed');
        res.json(cards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Export router for use in main application
module.exports = router;