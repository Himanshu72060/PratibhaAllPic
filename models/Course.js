const mongoose = require('mongoose');

const nestedCourseSchema = new mongoose.Schema({
    image: String,
    title: String,
    description: String,
    price: Number,
    duration: String,
    assignmentLink: String,
    liveClassLink: String
});

const courseSchema = new mongoose.Schema({
    name: String,
    image: String,
    courses: [nestedCourseSchema]
});

module.exports = mongoose.model('Course', courseSchema);