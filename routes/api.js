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
const User = require('../models/User'); // ✅ Added

// Multer Setup with filename cleaning
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const cleaned = file.originalname.replace(/\s+/g, '-');
        cb(null, Date.now() + '-' + cleaned);
    }
});
const upload = multer({ storage });


// Helper function to build full URL
const getImageUrl = (req, filePath) => {
    return `${req.protocol}://${req.get('host')}/${filePath.replace(/\\/g, '/')}`;
};

/* === Header Logo === */
router.post('/header-logo', upload.single('image'), async (req, res) => {
    try {
        const item = new HeaderLogo({ image: getImageUrl(req, req.file.path) });
        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/header-logo', async (req, res) => {
    try {
        const items = await HeaderLogo.find();
        res.json(items); // No image mapping, just raw data
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.put('/header-logo/:id', upload.single('image'), async (req, res) => {
    try {
        const update = req.file ? { image: getImageUrl(req, req.file.path) } : {};
        const updatedItem = await HeaderLogo.findByIdAndUpdate(req.params.id, update, { new: true });
        res.json({
            ...updatedItem.toObject(),
            image: getImageUrl(req, updatedItem.image) // Ensure full URL for image
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.delete('/header-logo/:id', async (req, res) => {
    try {
        await HeaderLogo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* === Courses === */
// ✅ POST - Create new course
router.post('/courses', upload.single('image'), async (req, res) => {
    try {
        const imageUrl = req.file ? getImageUrl(req, req.file.path) : null;

        const item = new Course({
            ...req.body,
            image: imageUrl,
            assignmentLink: req.body.assignmentLink,
            liveClassLink: req.body.liveClassLink
        });

        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ GET - All courses
router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ PUT - Update course
router.put('/courses/:id', upload.single('image'), async (req, res) => {
    try {
        const update = req.body;

        if (req.file) {
            update.image = getImageUrl(req, req.file.path);
        }

        const updated = await Course.findByIdAndUpdate(req.params.id, update, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ DELETE - Remove course
router.delete('/courses/:id', async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* === Events === */
// ✅ POST - Create new event
router.post('/events', upload.array('coverImage'), async (req, res) => {
    try {
        const coverImages = req.files ? req.files.map(file => getImageUrl(req, file.path)) : [];
        const item = new Event({
            ...req.body,
            coverImage: coverImages
        });
        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//  ✅ GET - All events
router.get('/events', async (req, res) => {
    try {
        const events = await Event.find();
        // Map to include full URL for cover images
        const eventsWithFullUrls = events.map(event => ({
            ...event.toObject(),
            coverImage: event.coverImage.map(image => getImageUrl(req, image))
        }));
        res.json(eventsWithFullUrls);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ PUT - Update event
router.put('/events/:id', upload.array('coverImage', 5), async (req, res) => {
    try {
        const update = req.body;
        if (req.files && req.files.length > 0) {
            update.coverImage = req.files.map(file => getImageUrl(req, file.path));
        }

        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, update, { new: true });
        res.json({
            ...updatedEvent.toObject(),
            coverImage: updatedEvent.coverImage.map(image => getImageUrl(req, image)) // Ensure full URL for images
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
});

// ✅ DELETE - Remove event
router.delete('/events/:id', async (req, res) => {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

/* === Gallery Header Image === */
router.post('/gallery-header', upload.single('image'), async (req, res) => {
    const itemurl = req.file ? getImageUrl(req, req.file.path) : null;
    const item = new Gallery({ image: itemurl });
    await item.save();
    res.json(item);
}
);
// ✅ GET - All gallery header images
router.get('/gallery-header', async (req, res) => {
    const items = await Gallery.find();
    // Map to include full URL for images
    const itemsWithFullUrls = items.map(item => ({
        ...item.toObject(),
        image: getImageUrl(req, item.image)
    }));
    res.json(itemsWithFullUrls);
});
router.put('/gallery-header/:id', upload.single('image'), async (req, res) => {
    const update = req.file ? { image: req.file.path } : {};
    res.json(await Gallery.findByIdAndUpdate(req.params.id, update, { new: true }));
});
router.delete('/gallery-header/:id', async (req, res) => {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});
/* === Gallery Images === */
router.post('/gallery', upload.single('image'), async (req, res) => {
    const item = req.file ? new Gallery({ image: req.file.path }) : null;
    if (item) {
        await item.save();
        res.json({
            ...item.toObject(),
            image: getImageUrl(req, item.image)  // Ensure full URL for image
        });
    } else {
        res.status(400).json({ error: 'Image file is required' });
    }
});
router.get('/gallery', async (req, res) => {
    const items = await Gallery.find();
    // Map to include full URL for images
    const itemsWithFullUrls = items.map(item => ({
        ...item.toObject(),
        image: getImageUrl(req, item.image)
    }));
    res.json(itemsWithFullUrls);
});
router.put('/gallery/:id', upload.single('image'), async (req, res) => {
    const update = req.file ? { image: req.file.path } : {};
    const updatedItem = await Gallery.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({
        ...updatedItem.toObject(),
        image: getImageUrl(req, updatedItem.image)  // Ensure full URL for image
    });
});
router.delete('/gallery/:id', async (req, res) => {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});


/* === Team Image === */
router.post('/team-image', upload.single('image'), async (req, res) => {
    const item = req.file ? new TeamImage({ image: req.file.path }) : null;
    if (item) {
        await item.save();
        res.json({
            ...item.toObject(),
            image: getImageUrl(req, item.image)  // Ensure full URL for image
        });
    } else {
        res.status(400).json({ error: 'Image file is required' });
    }
});
router.get('/team-image', async (req, res) => {
    const items = await TeamImage.find();
    // Map to include full URL for images
    const itemsWithFullUrls = items.map(item => ({
        ...item.toObject(),
        image: getImageUrl(req, item.image)
    }));
    res.json(itemsWithFullUrls);
});
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
    const item = req.file ? new Partner({ image: req.file.path }) : null;
    if (item) {
        await item.save();
        res.json({
            ...item.toObject(),
            image: getImageUrl(req, item.image)  // Ensure full URL for image
        });
    } else {
        res.status(400).json({ error: 'Image file is required' });
    }
});
router.get('/partners', async (req, res) => {
    const items = await Partner.find();
    // Map to include full URL for images
    const itemsWithFullUrls = items.map(item => ({
        ...item.toObject(),
        image: getImageUrl(req, item.image)
    }));
    res.json(itemsWithFullUrls);
});
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
    const item = req.file ? new HeaderHero({ image: req.file.path }) : null;
    if (item) {
        await item.save();
        res.json({
            ...item.toObject(),
            image: getImageUrl(req, item.image)  // Ensure full URL for image
        });
    } else {
        res.status(400).json({ error: 'Image file is required' });
    }
});
router.get('/header-hero', async (req, res) => {
    const items = await HeaderHero.find();
    // Map to include full URL for images
    const itemsWithFullUrls = items.map(item => ({
        ...item.toObject(),
        image: getImageUrl(req, item.image)
    }));
    res.json(itemsWithFullUrls);
});
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
    const socialLinks = req.body.socialLinks ? req.body.socialLinks.split(',') : [];
    const item = req.file ? new OurTeam({
        name: req.body.name,
        image: req.file.path,
        socialLinks: socialLinks
    }) : null;
    if (item) {
        await item.save();
        res.json({
            ...item.toObject(),
            image: getImageUrl(req, item.image)  // Ensure full URL for image
        });
    } else {
        res.status(400).json({ error: 'Image file is required' });
    }
});
router.get('/our-team', async (req, res) => {
    const items = await OurTeam.find();
    // Map to include full URL for images
    const itemsWithFullUrls = items.map(item => ({
        ...item.toObject(),
        image: getImageUrl(req, item.image)
    }));
    res.json(itemsWithFullUrls);
});
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

/* === Buy Course === */
router.post('/buy-course/:userId/:courseId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const courseId = req.params.courseId;
        if (!user.purchasedCourses.includes(courseId)) {
            user.purchasedCourses.push(courseId);
            await user.save();
        }

        res.json({
            message: 'Course purchased successfully',
            purchasedCourses: user.purchasedCourses
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
