const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema({
    name: String,
    companyName: String,
    image: String
});

module.exports = mongoose.model('Partner', PartnerSchema);
