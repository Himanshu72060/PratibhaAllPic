const mongoose = require('mongoose');

const HeaderHeroSchema = new mongoose.Schema({
    image: String
});

module.exports = mongoose.model('HeaderHero', HeaderHeroSchema);
