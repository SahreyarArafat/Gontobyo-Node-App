// External Inputs
const { body } = require('express-validator');

const usertechInfo = require('../models/user.tech.model');

exports.userTechValidator = [
    body('story').custom(async(story, { req }) => {
        const tech = await usertechInfo.findOne({ story });

        if (
            tech &&
            tech.story_title === req.body.story_title &&
            tech.writter_name === req.body.writter_name
        ) {
            const approvedTime = tech.Approved_time;

            return Promise.reject(
                `This tech story was already approved at ${approvedTime}! You may delete this.`,
            );
        }
        if (
            tech &&
            tech.story_title !== req.body.story_title &&
            tech.writter_name !== req.body.writter_name
        ) {
            return Promise.reject(
                'This tech story already exists on your site! You should not approve this.',
            );
        }
    }),
];