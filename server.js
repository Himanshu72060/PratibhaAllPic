require('dotenv').config(); // ✅ Load .env first

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');


dotenv.config();
const app = express();
const routes = require('./routes/api');
const serviceRoutes = require('./routes/serviceRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const contactRoutes = require('./routes/contactRoutes');
const blogRoutes = require('./routes/blogRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const courseRoutes = require('./routes/courseRoutes');
const studentZoneRoutes = require('./routes/studentZone');


// ✅ Allow multiple frontend origins
const allowedOrigins = [
    'http://localhost:3000',
    'https://pite-fawn.vercel.app',
    'https://pratibhaallpic.onrender.com'
];
// ✅ Proper CORS setup
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// ✅ Middleware
app.use(express.json());

// ✅ Serve uploads folder as static
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static('uploads'));

// ✅ API Routes
app.use('/api/about', aboutRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/student-zone', studentZoneRoutes);






app.use(express.static(path.join(__dirname, "public")));
app.use('/public', express.static(path.join(__dirname, "public")));

// ✅ Ensure uploads folder exists
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log("✅ 'uploads' folder created");
} else {
    console.log("✅ 'uploads' folder already exists");
}

// ✅ API Routes
app.use('/api', routes);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB Error:', err.message));

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));