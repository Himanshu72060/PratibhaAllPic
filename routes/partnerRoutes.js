const express = require('express');
const Partner = require('../models/Partner');
const upload = require('../middleware/upload');
const router = express.Router();

// Create Partner
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, companyName } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        const newPartner = new Partner({ name, companyName, image });
        await newPartner.save();
        res.json(newPartner);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all Partners
router.get('/', async (req, res) => {
    try {
        const partners = await Partner.find();
        res.json(partners);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Partner
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, companyName } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : undefined;

        const updatedData = { name, companyName };
        if (image) updatedData.image = image;

        const updatedPartner = await Partner.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );
        res.json(updatedPartner);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Partner
router.delete('/:id', async (req, res) => {
    try {
        await Partner.findByIdAndDelete(req.params.id);
        res.json({ message: 'Partner deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
