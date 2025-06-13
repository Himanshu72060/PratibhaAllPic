const mongoose = require('mongoose');

const HeaderLogoSchema = new mongoose.Schema({
    image: String
});

module.exports = mongoose.model('HeaderLogo', HeaderLogoSchema);
