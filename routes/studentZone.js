const express = require('express');
const multer = require('multer');
const StudentZone = require('../models/StudentZone');
const router = express.Router();
const path = require('path');

// multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// POST
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const student = new StudentZone({
            name: req.body.name,
            image: req.file ? req.file.filename : null
        });
        await student.save();
        res.status(201).json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET
router.get('/', async (req, res) => {
    try {
        const items = await StudentZone.find();
        const fullUrl = req.protocol + '://' + req.get('host');
        const updatedItems = items.map(item => ({
            ...item._doc,
            image: item.image ? `${fullUrl}/uploads/${item.image}` : null
        }));
        res.json(updatedItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
        };
        if (req.file) {
            updateData.image = req.file.filename;
        }
        const updated = await StudentZone.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        await StudentZone.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
