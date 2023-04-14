const mongoose = require('mongoose');
const date = new Date();

const postStorySchema = new mongoose.Schema({
    writing_type: {
        type: String,
        required: true,
    },
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
    },
    story: {
        type: String,
        required: true,
    },
    Posted_at: {
        type: String,
        required: true,
        default: date.toLocaleString(),
    },
    posted_by: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('UserStory', postStorySchema);