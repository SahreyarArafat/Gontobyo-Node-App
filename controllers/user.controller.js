// External Inputs
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { validationResult } = require('express-validator');

// Internal Inputs
const userInfo = require('../models/user.register.model');
const userStoryInfo = require('../models/user.post-story.model');
const userGolpoInfo = require('../models/user.golpo.model');
const userKobitaInfo = require('../models/user.kobita.model');
const userTechInfo = require('../models/user.tech.model');
const errorFormetter = require('../utils/validation-error-formatter.utils');

// Get Controllers
exports.getIndex = (req, res) => {
    res.render('index', {});
};

exports.getGolpo = (req, res) => {
    userGolpoInfo.find({}, (error, usergolpos) => {
        res.render('golpo', { usergolpos, messages: req.flash('success') });
    });
};

exports.getTechnology = (req, res) => {
    userTechInfo.find({}, (error, userteches) => {
        res.render('technology', { userteches, messages: req.flash('success') });
    });
};

exports.getKobita = (req, res) => {
    userKobitaInfo.find({}, (error, userkobitas) => {
        res.render('kobita', { userkobitas, messages: req.flash('success') });
    });
};

exports.getRegister = (req, res) => {
    res.render('register', { error: {}, value: {} });
};

exports.getLogin = (req, res) => {
    res.render('login', { error: {}, value: {}, messages: req.flash('success') });
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
    const {
        username,
        email,
        phone,
        password,
        agreement,
    } = req.body;

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
        bcrypt.hash(password, saltRounds, async(err, hash) => {
            const registerInfo = new userInfo({
                username,
                email,
                phone,
                password: hash,
                agreement,
            });
            registerInfo
                .save()
                .then(() => {
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

exports.postLogin = async(req, res, next) => {
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
    const { writing_type } = req.body;
    const { writter_name } = req.body;
    const { story_title } = req.body;
    const { story } = req.body;
    const { posted_by } = req.body;

    const errors = validationResult(req).formatWith(errorFormetter);
    if (!errors.isEmpty()) {
        return res.render('userstory', {
            error: errors.mapped(),
            value: {
                writing_type,
                writter_name,
                story_title,
                story,
            },
            messages: [],
        });
    }

    const UserStoryInfo = new userStoryInfo({
        writing_type,
        writter_name,
        story_title,
        story,
        posted_by,
    });
    if (req.file) {
        UserStoryInfo.storyimage = req.file.path;
    }
    UserStoryInfo.save()
        .then(() => {
            req.flash(
                'success',
                'Posted successfully! Your story is waiting for approval.',
            );
            res.redirect('/golpo');
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.postUserGolpo = (req, res) => {
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

    const golpoInfo = new userGolpoInfo({
        writter_name,
        story_title,
        story,
        post_time,
        storyimage,
    });
    golpoInfo
        .save()
        .then(() => {
            req.flash('success', 'Successfully approved!');
            res.redirect('/golpo');
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.postUserKobita = (req, res) => {
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

    const kobitaInfo = new userKobitaInfo({
        writter_name,
        story_title,
        story,
        storyimage,
        post_time,
    });
    if (req.file) {
        kobitaInfo.storyimage = req.file.path;
    }
    kobitaInfo
        .save()
        .then(() => {
            req.flash('success', 'Successfully approved!');
            res.redirect('/kobita');
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.postUserTech = (req, res) => {
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

    const techInfo = new userTechInfo({
        writter_name,
        story_title,
        story,
        storyimage,
        post_time,
    });
    if (req.file) {
        techInfo.storyimage = req.file.path;
    }
    techInfo
        .save()
        .then(() => {
            req.flash('success', 'Successfully approved!');
            res.redirect('/technology');
        })
        .catch((error) => {
            console.log(error);
        });
};

// Delete Controllers

exports.deleteUserStory = async(req, res) => {
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

exports.deleteUser = async(req, res) => {
    const { user_id } = req.body;
    const user = await userInfo.findOne({ _id: user_id });
    const userName = user.username;
    try {
        await userInfo.deleteOne({ _id: user_id });
        req.flash('success', `User '${userName}' has been deleted successfully!`);
        res.redirect('/gontobyo-users');
    } catch (error) {
        console.log(error);
    }
};