const express = require('express');
const router = express.Router();
const multer = require('multer');
require('dotenv').config();


// Models
const Course = require('../models/Course');
const Event = require('../models/Event');
const Gallery = require('../models/Gallery');
const HeaderLogo = require('../models/HeaderLogo');
const HeaderHero = require('../models/HeaderHero');
const OurTeam = require('../models/OurTeam');
const Partner = require('../models/Partner');
const TeamImage = require('../models/TeamImage');

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

/* === Header Logo === */

router.post('/header-logo', upload.single('image'), async (req, res) => {
    const item = new HeaderLogo({ image: req.file.path });
    await item.save();
    res.json(item);
});
router.get('/header-logo', async (req, res) => res.json(await HeaderLogo.find()));
router.put('/header-logo/:id', upload.single('image'), async (req, res) => {
    const update = req.file ? { image: req.file.path } : {};
    res.json(await HeaderLogo.findByIdAndUpdate(req.params.id, update, { new: true }));
});
router.delete('/header-logo/:id', async (req, res) => {
    await HeaderLogo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

/* === Courses === */
router.post('/courses', upload.single('image'), async (req, res) => {
    const item = new Course({ ...req.body, image: req.file.path });
    await item.save();
    res.json(item);
});
router.get('/courses', async (req, res) => res.json(await Course.find()));
router.put('/courses/:id', upload.single('image'), async (req, res) => {
    const update = req.body;
    if (req.file) update.image = req.file.path;
    res.json(await Course.findByIdAndUpdate(req.params.id, update, { new: true }));
});
router.delete('/courses/:id', async (req, res) => {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

/* === Events === */
router.post('/events', upload.single('image'), async (req, res) => {
    const item = new Event({ ...req.body, image: req.file.path });
    await item.save();
    res.json(item);
});
router.get('/events', async (req, res) => res.json(await Event.find()));
router.put('/events/:id', upload.single('image'), async (req, res) => {
    const update = req.body;
    if (req.file) update.image = req.file.path;
    res.json(await Event.findByIdAndUpdate(req.params.id, update, { new: true }));
});
router.delete('/events/:id', async (req, res) => {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

/* === Gallery === */
router.post('/gallery', upload.single('image'), async (req, res) => {
    const item = new Gallery({ image: req.file.path });
    await item.save();
    res.json(item);
});
router.get('/gallery', async (req, res) => res.json(await Gallery.find()));
router.put('/gallery/:id', upload.single('image'), async (req, res) => {
    const update = req.file ? { image: req.file.path } : {};
    res.json(await Gallery.findByIdAndUpdate(req.params.id, update, { new: true }));
});
router.delete('/gallery/:id', async (req, res) => {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

/* === Team Image === */
router.post('/team-image', upload.single('image'), async (req, res) => {
    const item = new TeamImage({ image: req.file.path });
    await item.save();
    res.json(item);
});
router.get('/team-image', async (req, res) => res.json(await TeamImage.find()));
router.put('/team-image/:id', upload.single('image'), async (req, res) => {
    const update = req.file ? { image: req.file.path } : {};
    res.json(await TeamImage.findByIdAndUpdate(req.params.id, update, { new: true }));
});
router.delete('/team-image/:id', async (req, res) => {
    await TeamImage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

/* === Partner Image === */
router.post('/partners', upload.single('image'), async (req, res) => {
    const item = new Partner({ image: req.file.path });
    await item.save();
    res.json(item);
});
router.get('/partners', async (req, res) => res.json(await Partner.find()));
router.put('/partners/:id', upload.single('image'), async (req, res) => {
    const update = req.file ? { image: req.file.path } : {};
    res.json(await Partner.findByIdAndUpdate(req.params.id, update, { new: true }));
});
router.delete('/partners/:id', async (req, res) => {
    await Partner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

/* === Header Hero === */
router.post('/header-hero', upload.single('image'), async (req, res) => {
    const item = new HeaderHero({ image: req.file.path });
    await item.save();
    res.json(item);
});
router.get('/header-hero', async (req, res) => res.json(await HeaderHero.find()));
router.put('/header-hero/:id', upload.single('image'), async (req, res) => {
    const update = req.file ? { image: req.file.path } : {};
    res.json(await HeaderHero.findByIdAndUpdate(req.params.id, update, { new: true }));
});
router.delete('/header-hero/:id', async (req, res) => {
    await HeaderHero.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

/* === Our Team === */
router.post('/our-team', upload.single('image'), async (req, res) => {
    const socialLinks = req.body.socialLinks?.split(',') || [];
    const item = new OurTeam({ ...req.body, image: req.file.path, socialLinks });
    await item.save();
    res.json(item);
});
router.get('/our-team', async (req, res) => res.json(await OurTeam.find()));
router.put('/our-team/:id', upload.single('image'), async (req, res) => {
    const update = req.body;
    if (req.body.socialLinks) update.socialLinks = req.body.socialLinks.split(',');
    if (req.file) update.image = req.file.path;
    res.json(await OurTeam.findByIdAndUpdate(req.params.id, update, { new: true }));
});
router.delete('/our-team/:id', async (req, res) => {
    await OurTeam.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

module.exports = router;
