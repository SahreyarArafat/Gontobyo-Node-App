// External Inputs
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { validationResult } = require('express-validator');
require('dotenv').config();
const nodeMailer = require('nodemailer');

// Internal Inputs
const userInfo = require('../models/user.register.model');
const userStoryInfo = require('../models/user.post-story.model');
const userApprovedStoryInfo = require('../models/user.approved-story.model');
const errorFormetter = require('../utils/validation-error-formatter.utils');

// Node Mailer Configuration Step

let nodeMailerEmail = process.env.NodeMailer_EMAIL;
let nodeMailerEmailPass = process.env.NodeMailerEMAIL_PASS;
let nodeMailerConfig = {
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: nodeMailerEmail,
        pass: nodeMailerEmailPass,
    },
};

const transporter = nodeMailer.createTransport(nodeMailerConfig);
// Get Controllers
exports.getIndex = (req, res) => {
    userApprovedStoryInfo.find({}, (error, userApprovedStories) => {
        res.render('index', {
            userApprovedStories,
        });
    });
};

exports.getGolpo = (req, res) => {
    userApprovedStoryInfo.find({}, (error, userApprovedStories) => {
        res.render('golpo', {
            userApprovedStories,
            messages: req.flash('success'),
        });
    });
};

exports.getTechnology = (req, res) => {
    userApprovedStoryInfo.find({}, (error, userApprovedStories) => {
        res.render('technology', {
            userApprovedStories,
            messages: req.flash('success'),
        });
    });
};

exports.getKobita = (req, res) => {
    userApprovedStoryInfo.find({}, (error, userApprovedStories) => {
        res.render('kobita', {
            userApprovedStories,
            messages: req.flash('success'),
        });
    });
};

exports.getRegister = (req, res) => {
    res.render('register', { error: {}, value: {} });
};

exports.getLogin = (req, res) => {
    res.render('login', {
        error: {},
        value: {},
        messages: req.flash('success'),
    });
};

exports.getUserStory = (req, res) => {
    res.render('userstory', {
        error: {},
        value: {},
        messages: req.flash('success'),
    });
};

exports.getApprovalPage = (req, res) => {
    userStoryInfo.find({}, (error, userstories) => {
        res.render('approval-page', {
            userstories,
            messages: req.flash('success'),
        });
    });
};

exports.getApprovalError = (req, res) => {
    res.render('approval-error', { error: {}, value: {} });
};

exports.getGontobyoUsers = (req, res) => {
    userInfo.find({}, (error, gontobyousers) => {
        res.render('gontobyo-users', {
            gontobyousers,
            messages: req.flash('success'),
        });
    });
};

exports.getLogout = (req, res, next) => {
    req.session.destroy((error) => {
        if (error) {
            console.log(error);
            return next(error);
        }

        return res.redirect('/');
    });
};

// Post Controllers

exports.postRegister = (req, res) => {
    const { username, email, phone, password, agreement } = req.body;

    const errors = validationResult(req).formatWith(errorFormetter);

    if (!errors.isEmpty()) {
        return res.render('register', {
            error: errors.mapped(),
            value: {
                username,
                email,
                phone,
                password,
                agreement,
            },
        });
    }

    try {
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            const registerInfo = new userInfo({
                username,
                email,
                phone,
                password: hash,
                agreement,
            });
            registerInfo
                .save()
                .then(async () => {
                    // Creating Mail information
                    let mailInfo = {
                        from: '"Gontobyo" <sadia@gmail.com>',
                        to: 'sahreyararafat@gmail.com',
                        subject: `New Account Created!`,
                        html: `<p>Created a new account on Gontobyo as <b>" ${username} "</b> using <h3>Email: ${email}</h3><h3>Phone Number: ${phone}</h3></p> `,
                    };

                    // Sending Mail via Nodemailer
                    const info = await transporter.sendMail(mailInfo);

                    // console.log('Message sent: %s', info.messageId);

                    req.flash('success', 'Successfully registered!');
                    res.redirect('/login');
                })
                .catch((error) => {
                    console.log(error);
                });
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
};

exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;

    const errors = validationResult(req).formatWith(errorFormetter);

    if (!errors.isEmpty()) {
        return res.render('login', {
            error: errors.mapped(),
            value: { email, password },
            messages: [],
        });
    }

    try {
        const userEmail = await userInfo.findOne({ email });
        if (!userEmail) {
            return res.json({
                message: 'Invalid user!',
            });
        }

        const userPassword = await bcrypt.compare(password, userEmail.password);

        if (!userPassword) {
            return res.json({
                message: 'Invalid user password!',
            });
        }

        if (
            userEmail.username === 'Admin' &&
            userEmail.email === 'gontobyoadmin@gmail.com'
        ) {
            req.session.AdminIsLoggedIn = true;
            req.session.isLoggedIn = true;
            req.session.user = userEmail;
            req.session.save((error) => {
                if (error) {
                    console.log(error);
                    return next(error);
                }
                req.flash('success', 'Welcome Mr.Admin!');
                res.redirect('/approval-page');
            });
        } else {
            req.session.isLoggedIn = true;
            req.session.user = userEmail;
            req.session.save((error) => {
                if (error) {
                    console.log(error);
                    return next(error);
                }
                req.flash('success', 'Successfully logged in!');
                res.redirect('/userstory');
            });
        }
    } catch (error) {
        console.log(error);
        next();
    }
};

exports.postUserStory = (req, res) => {
    const { story_type } = req.body;
    const { writter_name } = req.body;
    const { story_title } = req.body;
    const { story } = req.body;
    const { posted_by } = req.body;

    const errors = validationResult(req).formatWith(errorFormetter);
    if (!errors.isEmpty()) {
        return res.render('userstory', {
            error: errors.mapped(),
            value: {
                story_type,
                writter_name,
                story_title,
                story,
            },
            messages: [],
        });
    }

    const UserStoryInfo = new userStoryInfo({
        story_type,
        writter_name,
        story_title,
        story,
        posted_by,
    });
    if (req.file) {
        UserStoryInfo.storyimage = req.file.path;
    }
    UserStoryInfo.save()
        .then(async () => {
            // Creating Mail information
            let mailInfo = {
                from: '"Gontobyo" <sadia@gmail.com>',
                to: 'sahreyararafat@gmail.com',
                subject: `New Story Posted!`,
                html: `<p>New story posted to Gontobyo by <b>" ${posted_by} "</b> and awaiting approval. <h3>Story Type: ${story_type}</h3><h3>Writter Name: ${writter_name}</h3><h3>Story Title: ${story_title}</h3></p> `,
            };

            // Sending Mail via Nodemailer
            const info = await transporter.sendMail(mailInfo);

            // console.log('Message sent: %s', info.messageId);

            req.flash(
                'success',
                'Posted successfully! Your story is waiting for approval.'
            );

            if (story_type === 'golpo') {
                res.redirect('/golpo');
            } else if (story_type === 'tech') {
                res.redirect('/technology');
            } else if (story_type === 'kobita') {
                res.redirect('/kobita');
            } else {
                res.redirect('/');
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.postUserApprovedstory = (req, res) => {
    const { story_type } = req.body;
    const { writter_name } = req.body;
    const { story_title } = req.body;
    const { story } = req.body;
    const { storyimage } = req.body;
    const { post_time } = req.body;

    const errors = validationResult(req).formatWith(errorFormetter);
    if (!errors.isEmpty()) {
        return res.render('approval-error', {
            error: errors.mapped(),
        });
    }

    const approvedStoryInfo = new userApprovedStoryInfo({
        story_type,
        writter_name,
        story_title,
        story,
        post_time,
        storyimage,
    });
    approvedStoryInfo
        .save()
        .then(() => {
            req.flash('success', 'Successfully approved!');

            if (story_type === 'golpo') {
                res.redirect('/golpo');
            } else if (story_type === 'tech') {
                res.redirect('/technology');
            } else if (story_type === 'kobita') {
                res.redirect('/kobita');
            } else {
                res.redirect('/');
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

// Delete Controllers

exports.deleteUserStory = async (req, res) => {
    const { golpo_id } = req.body;
    const golpo = await userStoryInfo.findOne({ _id: golpo_id });
    const golpo_title = golpo.story_title;
    try {
        await userStoryInfo.deleteOne({ _id: golpo_id });
        req.flash('success', `'${golpo_title}' has been deleted successfully!`);
        res.redirect('/approval-page');
    } catch (error) {
        console.log(error);
    }
};

exports.deleteUser = async (req, res) => {
    const { user_id } = req.body;
    const user = await userInfo.findOne({ _id: user_id });
    const userName = user.username;
    try {
        await userInfo.deleteOne({ _id: user_id });
        req.flash(
            'success',
            `User '${userName}' has been deleted successfully!`
        );
        res.redirect('/gontobyo-users');
    } catch (error) {
        console.log(error);
    }
};
