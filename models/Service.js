const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String // store image filename
});

module.exports = mongoose.model('Service', serviceSchema);
