const mongoose = require('mongoose');

const TrafficSchema = new mongoose.Schema({
    page: { type: String, default: '/' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Traffic', TrafficSchema);
