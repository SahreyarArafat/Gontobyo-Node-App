// External Inputs
const express = require('express');
const router = express.Router();

// Internal Inputs
const {
    getIndex,
    getGolpo,
    getKobita,
    getRegister,
    getLogin,
    postRegister,
    postLogin,
    getUserStory,
    getLogout,
    postUserStory,
    postUserKobita,
    getTechnology,
    postUserTech,
    getApprovalPage,
    postUserGolpo,
    deleteUserStory,
    getApprovalError,
    getGontobyoUsers,
    deleteUser,
} = require('../controllers/user.controller');
const { loginValidator } = require('../validator/user.login.validator');
const { registerValidator } = require('../validator/user.registar.validator');
const {
    isAuthenticated,
    isUnAuthenticated,
    adminIsAuthenticated,
} = require('../middleware/authentication.middleware');
const { userStoryValidator } = require('../validator/user-story.validator');
const upload = require('../utils/multer-upload.util');
const { userKobitaValidator } = require('../validator/user.kobita.validator');
const { userTechValidator } = require('../validator/user.tech.validator');
const { userGolpoValidator } = require('../validator/user.golpo.validator');

// Get Routes
router.get('/', getIndex);

router.get('/golpo', getGolpo);

router.get('/technology', getTechnology);

router.get('/kobita', getKobita);

router.get('/register', isUnAuthenticated, getRegister);

router.get('/login', isUnAuthenticated, getLogin);

router.get('/userstory', isAuthenticated, getUserStory);

router.get('/approval-page', adminIsAuthenticated, getApprovalPage);

router.get('/approval-error', adminIsAuthenticated, getApprovalError);

router.get('/gontobyo-users', adminIsAuthenticated, getGontobyoUsers);

router.get('/logout', getLogout);

// Post Routes
router.post('/register', registerValidator, postRegister);

router.post('/login', loginValidator, postLogin);

router.post(
    '/userstory',
    upload.single('storyimage'),
    userStoryValidator,
    postUserStory,
);

router.post(
    '/usergolpo',
    upload.single('storyimage'),
    userGolpoValidator,
    postUserGolpo,
);

router.post(
    '/userkobita',
    upload.single('storyimage'),
    userKobitaValidator,
    postUserKobita,
);

router.post(
    '/usertech',
    upload.single('storyimage'),
    userTechValidator,
    postUserTech,
);

// Delete Routes

router.post('/delete-golpo', deleteUserStory);

router.post('/delete-user', deleteUser);

module.exports = router;