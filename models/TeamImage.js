const mongoose = require('mongoose');

const TeamImageSchema = new mongoose.Schema({
    image: String
});

module.exports = mongoose.model('TeamImage', TeamImageSchema);
