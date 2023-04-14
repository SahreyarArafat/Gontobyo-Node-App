exports.isAuthenticated = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
};

exports.isUnAuthenticated = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/');
    }
    next();
};

exports.adminIsAuthenticated = (req, res, next) => {
    if (!req.session.AdminIsLoggedIn) {
        return res.redirect('/');
    }
    next();
};