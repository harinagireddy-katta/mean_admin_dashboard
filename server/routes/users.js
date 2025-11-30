const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }, '-password'); // Only show customers, hide admins
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Generate Mock User
router.post('/generate', async (req, res) => {
    try {
        const randomId = Math.floor(Math.random() * 1000);
        const newUser = new User({
            username: `Customer_${randomId}`,
            password: 'password', // Dummy password
            role: 'user'
        });
        await newUser.save();

        // Emit socket event for real-time update
        const userCount = await User.countDocuments({ role: 'user', username: { $ne: 'admin' } });
        // We need to fetch sales/traffic too to keep the payload consistent, or just send partial updates
        // For simplicity, let's send the user count and let the frontend handle it
        req.io.emit('analyticsUpdate', {
            currentUsers: userCount,
            timestamp: new Date()
        });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
