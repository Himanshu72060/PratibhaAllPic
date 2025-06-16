require('dotenv').config(); // ✅ Load .env first

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const routes = require('./routes/api');
const fs = require('fs');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api', routes);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// ✅ Check MONGO_URI is loading
console.log('Mongo URI:', process.env.MONGO_URI);

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
