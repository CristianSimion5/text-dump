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

router.route('/edit/:id')
    .get((req, res) => {
        Dump.findById(req.params.id, (err, dump) => {
            if (err)  console.log(err);
            else {
                res.render('edit_dump', {
                    title: "Edit dump",
                    dump
                });
            }
        });
    })
    .post((req, res) => {
        let dump = {};
        dump.title = req.body.title;
        dump.body = req.body.body;

        let query = { _id: req.params.id };

        Dump.updateOne(query, dump, (err) => {
            if (err)    console.log(err);
            else {
                req.flash('success', 'Dump edited');
                res.redirect('/success');
            }
        });
    })


router.route('/add')
    .get((req, res) => {
        res.render('add_dump', {
            title: 'Add Dump'
        });
    })
    .post((req, res) => {
        let dump = new Dump();
        dump.title = req.body.title;
        dump.author = req.body.author;
        dump.body = req.body.body;
    
        dump.save((err) => {
            if (err)    console.log(err);
            else {
                req.flash('success', 'Dump Added');
                res.redirect('/success');
            }
        });
    });

router.route('/:id')
    // Load individual dump view
    .get((req, res) => {
        Dump.findById(req.params.id, (err, dump) => {
            if (err)  console.log(err);
            else {
                res.render('dump', {
                    dump
                });
            }
        });
    })
    .delete((req, res) => {
        let query = { _id: req.params.id};
    
        Dump.remove(query, (err) => {
            if (err)    console.log(err);
            else {
                res.send('DELETE request');
            }
        });
    });

module.exports = router;