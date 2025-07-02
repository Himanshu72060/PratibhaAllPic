const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ✅ CREATE course with nested array
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, courses } = req.body;
        const newCourse = new Course({
            name,
            image: req.file ? `/uploads/${req.file.filename}` : '',
            courses: JSON.parse(courses)
        });
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ READ all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ UPDATE course
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, courses } = req.body;
        const updatedData = {
            name,
            courses: JSON.parse(courses)
        };
        if (req.file) updatedData.image = `/uploads/${req.file.filename}`;
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.json(updatedCourse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ DELETE course
router.delete('/:id', async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: 'Course deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
