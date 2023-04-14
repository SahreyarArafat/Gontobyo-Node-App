// Internal Inputs
const userInfo = require('../models/user.register.model');

exports.bindUserWithRequest = () => async(req, res, next) => {
    if (!req.session.isLoggedIn) {
        return next();
    }
    try {
        const user = await userInfo.findById(req.session.user._id);
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
};