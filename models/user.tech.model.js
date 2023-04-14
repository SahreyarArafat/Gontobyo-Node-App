const mongoose = require('mongoose');

const date = new Date();

const usertechSchema = new mongoose.Schema({
    writter_name: {
        type: String,
        require: true,
    },
    story_title: {
        type: String,
        require: true,
    },
    storyimage: {
        type: String,
        require: true,
    },
    story: {
        type: String,
        require: true,
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

module.exports = mongoose.model('UserTech', usertechSchema);