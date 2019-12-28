const express = require('express');
const path = require('path');
const router = express.Router();

// Load the model
let Dump = require('../models/dump');
let User = require('../models/user');

//router.use(express.static(path.join(__dirname, '../static')));

router.get('/', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../static/index.html"));
});

router.get('/get', ensureAuthenticated, (req, res) => {
    Dump.find({ uid: req.user._id }, (err, dumps) => {
        if (err) {
            console.log(err);
        } else {
            res.send(dumps);
        }
    });
});

router.route('/edit/:id')
    .get(ensureAuthenticated, ensureDumpOwner, (req, res) => {
        res.render('edit_dump', {
            title: "Edit dump",
            dump: res.locals.dump
        });
    })
    .post(ensureAuthenticated, ensureDumpOwner, (req, res) => {
        let dump = {};
        dump.title = req.body.title;
        dump.body = req.body.body;
        dump.modified = new Date();
        dump.size = dump.body.length;

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
    .get(ensureAuthenticated, (req, res) => {
        res.render('add_dump', {
            title: 'Add Dump'
        });
    })
    .post(ensureAuthenticated, (req, res) => {
        let dump = new Dump();
        dump.uid = req.user._id;
        dump.title = req.body.title;
        dump.body = req.body.body;
        dump.created = new Date();
        dump.modified = new Date();
        dump.size = dump.body.length;

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
    .get(ensureAuthenticated, ensureDumpOwner, (req, res) => {
        res.render('dump', {
            dump: res.locals.dump,
            author: req.user.name
        });
    })
    .delete(ensureAuthenticated, ensureDumpOwner, (req, res) => {
        let query = { _id: req.params.id};
    
        Dump.remove(query, (err) => {
            if (err)    console.log(err);
            else {
                res.send('DELETE request');
            }
        });
    });

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).render('unauthorized');
    }
}

function ensureDumpOwner(req, res, next) {
    Dump.findById(req.params.id, (err, dump) => {
        if (err)  console.log(err, "here");
        else if (dump.uid != req.user._id) {
            res.status(401).render('unauthorized');
        } else {
            res.locals.dump = dump;
            next();
        }
    });
}

module.exports = router;