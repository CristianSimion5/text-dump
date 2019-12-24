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

app.use(express.static(path.join(__dirname, 'static')));

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
    /*Dump.find({}, (err, dumps) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                title: "My files",
                dumps
            });
        }
    });*/
    res.sendFile(path.join(__dirname, "/static/index.html"));
});

app.get('/dumps', (req, res) => {
    Dump.find({}, (err, dumps) => {
        if (err) {
            console.log(err);
        } else {
            res.send(dumps);
        }
    });
});

app.get('/dumps/edit/:id', (req, res) => {
    Dump.findById(req.params.id, (err, dump) => {
        if (err)  console.log(err);
        else {
            res.render('edit_dump', {
                title: "Edit dump",
                dump
            });
        }
    });
});

app.post('/dumps/edit/:id', (req, res) => {
    let dump = {};
    dump.title = req.body.title;
    dump.body = req.body.body;

    let query = { _id: req.params.id};

    Dump.updateOne(query, dump, (err) => {
        if (err)    console.log(err);
        else {
            res.redirect('/');
        }
    });
});

app.delete('/dumps/:id', (req, res) => {
    let query = { _id: req.params.id};

    Dump.remove(query, (err) => {
        if (err)    console.log(err);
        else {
            res.send('The dump was deleted');
        }
    });
});

app.get('/dumps/add', (req, res) => {
    res.render('add_dump', {
        title: 'Add Dump'
    });
});

// Load individual dump view
app.get('/dumps/:id', (req, res) => {
    Dump.findById(req.params.id, (err, dump) => {
        if (err)  console.log(err);
        else {
            res.render('dump', {
                dump
            });
        }
    });
})

app.post('/dumps/add', (req, res) => {
    let dump = new Dump();
    dump.title = req.body.title;
    dump.author = req.body.author;
    dump.body = req.body.body;

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