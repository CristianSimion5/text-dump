/**
 * Simion Cristian
 */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

// Connect to database
mongoose.connect("mongodb://localhost/text-dump", { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;

const app = express();

// Setup bodyParser
app.use(bodyParser.urlencoded( { extended: false }));
app.use(bodyParser.json());

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
            res.render('index', {
                title: "My files",
                dumps
            });
        }
    });
});

app.get('/dumps/add', (req, res) => {
    res.render('add_dump', {
        title: 'Add Dump'
    });
});

app.post('/dumps/add', (req, res) => {
    let dump = new Dump();
    dump.title = req.body.title;
    dump.author = req.body.author;
    dump.path = req.body.path;

    dump.save((err) => {
        if (err)    console.log(err);
        else {
            res.redirect('/');
        }
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server started on port 3000...");
})