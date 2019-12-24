/**
 * Simion Cristian
 */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const config = require('./config/database');


// Connect to database
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;

const app = express();

// Setup bodyParser
app.use(bodyParser.urlencoded( { extended: false }));
app.use(bodyParser.json());

// express-session Middleware
app.set('truest proxy', 1);
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUnitialized: true,
    cookie: { secure: true },
}));

// express-messages Middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Passport configuration
require('./config/passport.js')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Check database connection
db.once('open', () => {
    console.log('Connected successfully to the database');
});

// Check database error
db.on('error', (err) => {
    console.log(err);
});

// Load the model
let Dump = require('./models/dump');

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    Dump.find({}, (err, dumps) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index.pug', {
                title: "My files",
                dumps
            });
        }
    });
});

// Route files
let dumps = require('./routes/dumps');
let users = require('./routes/users');
app.use('/dumps', dumps);
app.use('/users', users);

// Start server
app.listen(3000, () => {
    console.log("Server started on port 3000...");
})