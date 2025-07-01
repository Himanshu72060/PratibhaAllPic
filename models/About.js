const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String
});

module.exports = mongoose.model('About', AboutSchema);
