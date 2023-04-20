// External Inputs
const { body } = require('express-validator');

const userApprovedStoryInfo = require('../models/user.approved-story.model');

exports.userApproveStoryValidator = [
    body('story').custom(async (story, { req }) => {
        const golpo = await userApprovedStoryInfo.findOne({ story });

        if (
            golpo &&
            golpo.story_title === req.body.story_title &&
            golpo.writter_name === req.body.writter_name
        ) {
            const approvedTime = golpo.Approved_time;

            return Promise.reject(
                `This golpo was already approved at ${approvedTime}! You may delete this.`
            );
        }
        if (
            golpo &&
            golpo.story_title !== req.body.story_title &&
            golpo.writter_name !== req.body.writter_name
        ) {
            return Promise.reject(
                'This golpo already exists on your site! You should not approve this.'
            );
        }
    }),
];
