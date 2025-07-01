const express = require('express');
const multer = require('multer');
const Service = require('../models/Service');
const router = express.Router();

// ✅ Add this function here
function getImageUrl(req, imagePath) {
    if (!imagePath) return null;
    const host = req.protocol + '://' + req.get('host');
    return imagePath.startsWith('/uploads')
        ? host + imagePath
        : host + '/' + imagePath;
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

/* === Services === */
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const item = new Service({
            ...req.body,
            image: getImageUrl(req, req.file.path)
        });
        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const items = await Service.find();
        // Map to include full URL for images
        const itemsWithFullUrls = items.map(item => ({
            ...item.toObject(),
            image: getImageUrl(req, item.image)
        }));
        res.json(itemsWithFullUrls);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const update = req.body;
        if (req.file) {
            update.image = getImageUrl(req, req.file.path);
        }
        const updatedItem = await Service.findByIdAndUpdate(req.params.id, update, { new: true });
        res.json({
            ...updatedItem.toObject(),
            image: getImageUrl(req, updatedItem.image) // Ensure full URL for image
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
