const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    name: String,
    category: String,
    title: String,
    images: [String],
    isNewPost: Boolean
}, { timestamps: true });

module.exports = mongoose.model('Blog', BlogSchema);
