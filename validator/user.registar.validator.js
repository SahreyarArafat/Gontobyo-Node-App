// External Inputs
const { body } = require('express-validator');

// Internal Inputs
const userInfo = require('../models/user.register.model');

// Register validation array
exports.registerValidator = [
    body('username')
        .not()
        .isEmpty()
        .withMessage('User name must be given!')
        .isLength({ min: 3, max: 25 })
        .withMessage('Username must be mentioned within 3 to 25 characters!')
        .custom(async (username) => {
            const userName = await userInfo.findOne({ username });
            if (userName) {
                return Promise.reject('This username is already in use!');
            }
        })
        .trim(),

    body('email')
        .not()
        .isEmpty()
        .withMessage("Email couldn't be empty!")
        .isEmail()
        .withMessage('A valid email address is required!')
        .toLowerCase()
        .trim()
        .custom(async (email) => {
            const userEmail = await userInfo.findOne({ email });
            if (userEmail) {
                return Promise.reject('This email is already in use!');
            }
        }),

    body('phone')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Phone number is mandatory!')
        .isMobilePhone('bn-BD', { strictMode: false })
        .withMessage('Provide a valid Bangladeshi Number.')
        .custom(async (phone) => {
            const userPhone = await userInfo.findOne({ phone });
            if (userPhone) {
                return Promise.reject('This number is already in use!');
            }
        }),

    body('password')
        .not()
        .isEmpty()
        .withMessage("Password is your security, it can't be empty.")
        .isLength({ min: 6 })
        .withMessage('Passwords must be longer than 5 characters!'),

    body('agreement').custom((agreement, { req }) => {
        if (req.body.agreement !== 'agreed') {
            throw new Error('This checkbox must be checked!');
        }

        // Indicates the success of this synchronous custom validator
        return true;
    }),
];
