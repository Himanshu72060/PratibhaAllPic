const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// POST: Create Blog
router.post('/', upload.array('images', 5), async (req, res) => {
    try {
        const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
        const blog = new Blog({
            name: req.body.name,
            category: req.body.category,
            title: req.body.title,
            images: imagePaths,
            isNew: req.body.isNew === 'true'
        });
        await blog.save();
        res.status(201).json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: All Blogs with full image URLs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find();

        const fullUrl = req.protocol + '://' + req.get('host');
        const blogsWithFullUrls = blogs.map(blog => ({
            ...blog.toObject(),
            images: blog.images.map(img => fullUrl + img)
        }));

        res.json(blogsWithFullUrls);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', upload.array('images', 5), async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            category: req.body.category,
            title: req.body.title,
            isNew: req.body.isNew === 'true'
        };

        if (req.files && req.files.length > 0) {
            const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
            updateData.images = imagePaths;
        }

        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedBlog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
