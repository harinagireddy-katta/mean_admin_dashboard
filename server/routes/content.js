const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

// Get all content
router.get('/', async (req, res) => {
    try {
        const content = await Content.find().sort({ createdAt: -1 });
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create content
router.post('/', async (req, res) => {
    try {
        const { title, body, status } = req.body;
        const newContent = new Content({
            title,
            body,
            status
        });
        await newContent.save();

        // Emit event for real-time updates if needed
        // req.io.emit('contentUpdated', newContent);

        res.status(201).json(newContent);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete content
router.delete('/:id', async (req, res) => {
    try {
        await Content.findByIdAndDelete(req.params.id);
        res.json({ message: 'Content deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
