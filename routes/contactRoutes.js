const express = require('express');
const router = express.Router();
const multer = require('multer');
const Contact = require('../models/Contact');

// ✅ Helper to return full image URL
function getImageUrl(req, imagePath) {
    if (!imagePath) return null;
    const host = req.protocol + '://' + req.get('host');
    return imagePath.startsWith('/uploads') ? host + imagePath : host + '/' + imagePath;
}

// Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// POST - Create
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const contact = new Contact({
            name: req.body.name,
            description: req.body.description,
            image: req.file ? req.file.filename : null
        });
        await contact.save();
        res.status(201).json(contact);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - All
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find();
        const fullContacts = contacts.map(item => ({
            ...item.toObject(),
            image: item.image ? `${req.protocol}://${req.get('host')}/uploads/${item.image}` : null
        }));
        res.json(fullContacts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Update
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            description: req.body.description
        };
        if (req.file) {
            updateData.image = req.file.filename;
        }
        const updatedContact = await Contact.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedContact);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
