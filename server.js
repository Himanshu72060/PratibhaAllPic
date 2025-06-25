require('dotenv').config(); // ✅ Load .env first

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const routes = require('./routes/api');

// ✅ Allow multiple frontend origins (localhost + deployed)
const allowedOrigins = [
    'http://localhost:3000',
    'https://image-api-nmwn.onrender.com', // optional: backend origin
    'https://your-frontend.onrender.com' // 🔁 replace with your deployed React URL if needed
];

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
app.use('/uploads', express.static(uploadsPath));

// ✅ Ensure uploads directory exists
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log("✅ 'uploads' folder created");
} else {
    console.log("✅ 'uploads' folder already exists");
}

// ✅ API routes
app.use('/api', routes);

// ✅ Debug Mongo URI
console.log('Mongo URI:', process.env.MONGO_URI);

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB Error:', err));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
