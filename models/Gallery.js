const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
    image: String
});

module.exports = mongoose.model('Gallery', GallerySchema);
