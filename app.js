// External Inputs
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');

// Internal Inputs
const userRouter = require('./routes/user.route');
const {
    bindUserWithRequest,
} = require('./middleware/bindUserWithRequest.middleware');
const setLocals = require('./middleware/setLocals.middleware');

// DotEnv Inputs.
const PORT = process.env.PORT || 8080;
const DB = process.env.DB;

// Mongoose Connection
mongoose
    .connect(DB)
    .then(() => {
        console.log('DB is connected');
    })
    .catch((error) => {
        console.log(`DB is not connected! ${error}`);
        process.exit(1);
    });

// Mongo DB store
const store = new MongoDBStore({
    uri: DB,
    collection: 'GontobyoSessions',
    expires: 1000 * 60 * 60 * 2,
});

// Setting view engine
app.set('view engine', 'ejs');

// Static file
app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, '/views')));
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        store,
    })
);
app.use(flash());
app.use(bindUserWithRequest());
app.use(setLocals());
app.use(userRouter);
app.use((req, res) => {
    res.render('crush');
});

// Node server
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
