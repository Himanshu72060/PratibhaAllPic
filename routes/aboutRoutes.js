const express = require('express');
const multer = require('multer');
const About = require('../models/About');
const router = express.Router();

// ✅ Helper to return full image URL
function getImageUrl(req, imagePath) {
    if (!imagePath) return null;
    const host = req.protocol + '://' + req.get('host');
    return imagePath.startsWith('/uploads') ? host + imagePath : host + '/' + imagePath;
}

// ✅ Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

/* === About Us Routes === */

// POST
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const about = new About({
            ...req.body,
            image: getImageUrl(req, '/uploads/' + req.file.filename)
        });
        await about.save();
        res.status(201).json(about);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET
router.get('/', async (req, res) => {
    try {
        const aboutItems = await About.find();
        const fullItems = aboutItems.map(item => ({
            ...item.toObject(),
            image: getImageUrl(req, item.image)
        }));
        res.json(fullItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const update = req.body;
        if (req.file) {
            update.image = getImageUrl(req, '/uploads/' + req.file.filename);
        }
        const updated = await About.findByIdAndUpdate(req.params.id, update, { new: true });
        res.json({
            ...updated.toObject(),
            image: getImageUrl(req, updated.image)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        await About.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
