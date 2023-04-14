// External Inputs
const { body } = require('express-validator');

const userKobitaInfo = require('../models/user.kobita.model');

exports.userKobitaValidator = [
    body('story').custom(async(story, { req }) => {
        const kobita = await userKobitaInfo.findOne({ story });

        if (
            kobita &&
            kobita.story_title === req.body.story_title &&
            kobita.writter_name === req.body.writter_name
        ) {
            const approvedTime = kobita.Approved_time;

            return Promise.reject(
                `This kobita was already approved at ${approvedTime}! You may delete this.`,
            );
        }
        if (
            kobita &&
            kobita.story_title !== req.body.story_title &&
            kobita.writter_name !== req.body.writter_name
        ) {
            return Promise.reject(
                'This kobita already exists on your site! You should not approve this.',
            );
        }
    }),
];