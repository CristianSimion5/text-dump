const express = require('express');
const path = require('path');
const router = express.Router();

// Load the model
let Dump = require('../models/dump');

router.use(express.static(path.join(__dirname, '../static')));

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../static/index.html"));
});

// TODO - change global to username
router.get('/global', (req, res) => {
    Dump.find({}, (err, dumps) => {
        if (err) {
            console.log(err);
        } else {
            res.send(dumps);
        }
    });
});

router.get('/edit/:id', (req, res) => {
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

router.post('/edit/:id', (req, res) => {
    let dump = {};
    dump.title = req.body.title;
    dump.body = req.body.body;

    let query = { _id: req.params.id};

    Dump.updateOne(query, dump, (err) => {
        if (err)    console.log(err);
        else {
            res.redirect('/dumps');
        }
    });
});

router.delete('/:id', (req, res) => {
    let query = { _id: req.params.id};

    Dump.remove(query, (err) => {
        if (err)    console.log(err);
        else {
            res.send('DELETE request');
        }
    });
});

router.get('/add', (req, res) => {
    res.render('add_dump', {
        title: 'Add Dump'
    });
});

// Load individual dump view
router.get('/:id', (req, res) => {
    Dump.findById(req.params.id, (err, dump) => {
        if (err)  console.log(err);
        else {
            res.render('dump', {
                dump
            });
        }
    });
})

router.post('/add', (req, res) => {
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

module.exports = router;