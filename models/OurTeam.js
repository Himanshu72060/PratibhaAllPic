const mongoose = require('mongoose');

const OurTeamSchema = new mongoose.Schema({
    image: String,
    role: String,
    name: String,
    about: String,
    socialLinks: [String]  // Example: ["https://twitter.com/user", "https://linkedin.com/in/user"]
});

module.exports = mongoose.model('OurTeam', OurTeamSchema);
