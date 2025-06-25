const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    image: String,
    title: String,
    description: String,
    price: Number,
    duration: String
});

module.exports = mongoose.model('Course', CourseSchema);
