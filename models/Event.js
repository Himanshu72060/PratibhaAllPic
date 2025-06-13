const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    image: String,
    name: String,
    date: String
});

module.exports = mongoose.model('Event', EventSchema);
