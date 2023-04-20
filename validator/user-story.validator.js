// External Inputs
const { body } = require('express-validator');

exports.userStoryValidator = [
    body('writter_name')
        .trim()
        .not()
        .isEmpty()
        .withMessage('লেখকের নাম পূর্ণ করা আবশ্যক!')
        .isLength({ min: 4, max: 25 })
        .withMessage('লেখকের নাম ৪ থেকে ২৫ অক্ষর পর্যন্ত হতে হবে!'),

    body('story_title')
        .not()
        .isEmpty()
        .withMessage('গল্পের অবশ্যই একটি শিরোনাম থাকতে হবে!')
        .isLength({ max: 50 })
        .withMessage('শিরোনাম সর্বোচ্চ ৫০ অক্ষরের হতে পারে!'),

    body('story')
        .not()
        .isEmpty()
        .withMessage('অবশ্যই একটি গল্প দিতে হবে!')
        .isLength({ min: 400 })
        .withMessage('গল্পটি কমপক্ষে ১০০ শব্দের হতে হবে!'),
];
