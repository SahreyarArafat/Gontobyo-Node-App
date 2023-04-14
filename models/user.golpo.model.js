const mongoose = require('mongoose');
const date = new Date();

const usergolpoSchema = new mongoose.Schema({
    writter_name: {
        type: String,
        required: true,
    },
    story_title: {
        type: String,
        required: true,
    },
    storyimage: {
        type: String,
        required: true,
    },
    story: {
        type: String,
        required: true,
    },
    post_time: {
        type: String,
        required: true,
    },
    Approved_time: {
        type: String,
        required: true,
        default: date.toLocaleString(),
    },
});

module.exports = mongoose.model('UserGolpo', usergolpoSchema);