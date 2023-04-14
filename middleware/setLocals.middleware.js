module.exports = () => (req, res, next) => {
    res.locals.AdminIsLoggedIn = req.session.AdminIsLoggedIn;

    res.locals.user = req.user;
    res.locals.isLoggedIn = req.session.isLoggedIn;
    next();
};