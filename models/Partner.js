const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema({
    image: String
});

module.exports = mongoose.model('Partner', PartnerSchema);
