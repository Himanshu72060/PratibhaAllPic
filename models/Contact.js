const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String
});

module.exports = mongoose.model('Contact', ContactSchema);
