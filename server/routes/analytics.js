const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Traffic = require('../models/Traffic');
const User = require('../models/User');

// Get analytics data
router.get('/', async (req, res) => {
    try {
        // Count users who are NOT 'admin' role AND username is not 'admin'
        const userCount = await User.countDocuments({ role: 'user', username: { $ne: 'admin' } });

        // Get real sales count
        const salesCount = await Sale.countDocuments();

        // Get real traffic count
        const trafficCount = await Traffic.countDocuments();

        // Mock historical data for charts (since we don't have historical tracking yet)
        // But current totals will be REAL
        const data = {
            sales: [12, 19, 3, 5, 2, salesCount], // Last point is real total
            users: [userCount, userCount, userCount, userCount, userCount, userCount],
            traffic: [50, 60, 40, 70, 80, trafficCount], // Last point is real total
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            currentUsers: userCount,
            currentSales: salesCount,
            currentTraffic: trafficCount
        };
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Record a Sale
router.post('/sale', async (req, res) => {
    try {
        const newSale = new Sale({ amount: req.body.amount || 100 });
        await newSale.save();

        // Emit socket event for real-time update
        const salesCount = await Sale.countDocuments();
        const trafficCount = await Traffic.countDocuments();
        const userCount = await User.countDocuments({ role: 'user', username: { $ne: 'admin' } }); // Fetch user count too

        req.io.emit('analyticsUpdate', {
            sales: salesCount,
            traffic: trafficCount,
            currentUsers: userCount, // Add this!
            timestamp: new Date()
        });

        res.status(201).json(newSale);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Record Traffic
router.post('/traffic', async (req, res) => {
    try {
        const newTraffic = new Traffic({ page: req.body.page || '/' });
        await newTraffic.save();

        // Emit socket event
        const salesCount = await Sale.countDocuments();
        const trafficCount = await Traffic.countDocuments();
        const userCount = await User.countDocuments({ role: 'user', username: { $ne: 'admin' } });

        req.io.emit('analyticsUpdate', {
            sales: salesCount,
            traffic: trafficCount,
            currentUsers: userCount,
            timestamp: new Date()
        });

        res.status(201).json(newTraffic);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
