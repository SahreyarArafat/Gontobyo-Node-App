// External Inputs
const { body } = require('express-validator');
const bcrypt = require('bcrypt');

// Internal Inputs
const userInfo = require('../models/user.register.model');

// Login validation array
exports.loginValidator = [
    body('email')
    .not()
    .isEmpty()
    .withMessage('Email couldn\'t be empty!')
    .isEmail()
    .withMessage('A registered valid email address is mandatory!')
    .toLowerCase()
    .trim()
    .custom(async(email) => {
        const userEmail = await userInfo.findOne({ email });

        if (!userEmail) {
            return Promise.reject('Your account couldn\'t be found!');
        }
    }),

    body('password')
    .not()
    .isEmpty()
    .withMessage('Password must be given!')
    .custom(async(password, { req }) => {
        const { email } = req.body;
        const userEmail = await userInfo.findOne({ email });
        const userPassword = await bcrypt.compare(
            password,
            userEmail.password,
        );

        if (!userPassword) {
            throw new Error('Password doesn\'t match!');
        }

        // Indicates the success of this synchronous custom validator
        return true;
    }),
];