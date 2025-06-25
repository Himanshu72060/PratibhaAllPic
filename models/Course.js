const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    image: String,
    title: String,
    description: String,
    price: Number,
    duration: String,
    assignmentLink: String,
    liveClassLink: String
});

module.exports = mongoose.model('Course', CourseSchema);
