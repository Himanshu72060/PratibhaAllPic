const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    date: String,
    name: String,
    coverImage: [String] // array of image URLs/paths
});

module.exports = mongoose.model('Event', EventSchema);