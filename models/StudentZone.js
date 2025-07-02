const mongoose = require('mongoose');

const studentZoneSchema = new mongoose.Schema({
    name: String,
    image: String
});

module.exports = mongoose.model('StudentZone', studentZoneSchema);
