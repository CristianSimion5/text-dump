const express = require('express');
const path = require('path');
const router = express.Router();

const { dumpValidationRules, validate } = require('../validator.js');

// Load the model
let Dump = require('../models/dump');
let User = require('../models/user');

router.use(express.static(path.join(__dirname, '../static')));

router.get('/', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../static', 'dumps.html'));
});

router.get('/get', ensureAuthenticated, (req, res) => {
    Dump.find({ uid: req.user._id, ...req.query }, (err, dumps) => {
        if (err) {
            console.log(err);
        } else {
            res.send(dumps);
        }
    });
});

router.get('/favorites', ensureAuthenticated, (req, res) => {
    res.render('show_favorites');
});

router.get('/deleted', ensureAuthenticated, (req, res) => {
    res.render('show_deleted');
});

router.route('/edit/:id')
    .get(ensureAuthenticated, ensureDumpOwner, (req, res) => {
        res.render('edit_dump', {
            dump: res.locals.dump
        });
    })
    .put(dumpValidationRules(), validate, ensureAuthenticated, ensureDumpOwner, (req, res) => {
        if (req.errors.errors.length > 0) {
            res.render('edit_dump', {
                dump: res.locals.dump,
                user: req.user,
                errors: req.errors.errors
            });
        } else {
            let dump = {};
            dump.title = req.body.title;
            dump.body = req.body.body;
            dump.modified = new Date();
            dump.size = (new TextEncoder().encode(dump.body)).length;
    
            let query = { _id: req.params.id };
    
            Dump.updateOne(query, dump, (err) => {
                if (err)    console.log(err);
                else {
                    req.flash('success', 'Dump edited');
                    res.send('Dump successfully edited');
                }
            });
        }
    })

router.get('/restore/:id', ensureAuthenticated, ensureDumpOwner, (req, res) => {
    let query = { _id: req.params.id };
    Dump.updateOne(query, { deleted: false }, (err) => {
        if (err)    console.log(err);
        else {
            req.flash('success', 'Dump restored');
            res.send('Dump restored successfully');
        }
    });
});

router.get('/star/:id', ensureAuthenticated, ensureDumpOwner, (req, res) => {
    let query = { _id: req.params.id };
    Dump.findOne(query, (err, dump) => {
        if (err)    console.log(err);
        else {
            dump.favorite = !dump.favorite;
            dump.save((err) => {
                if (err)    console.log(err);
                else {
                    res.send('Dump starred/unstarred successfully');
                }
            });
        }
    });
});

router.route('/add')
    .get(ensureAuthenticated, (req, res) => {
        res.render('add_dump', {
            title: 'Add new dump'
        });
    })
    .post(dumpValidationRules(), validate, ensureAuthenticated, (req, res) => {
        if (req.errors.errors.length > 0) {
            res.render('add_dump', {
                title: "Add new dump",
                user: req.user,
                errors: req.errors.errors
            });
        } else {
            let dump = new Dump();
            dump.uid = req.user._id;
            dump.title = req.body.title;
            dump.body = req.body.body;
            dump.created = new Date();
            dump.modified = new Date();
            dump.size = (new TextEncoder().encode(dump.body)).length;;

            dump.save((err) => {
                if (err)    console.log(err);
                else {
                    req.flash('success', 'Dump Added');
                    res.send('Dump successfully added');
                }
            });
        }        
    });

router.get('/success', ensureAuthenticated, (req, res) => {
    res.render('success', {
        user: req.user
    });
});

router.get('/total_size', ensureAuthenticated, (req, res) => {
    Dump.find({ uid: req.user._id }, (err, dumps) => {
        if (err) {
            console.log(err);
        } else {
            let total_size = 0;
            dumps.forEach(dump => {
                total_size += dump.size;
            });
            res.json({ size: total_size });
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
        if (res.locals.dump.deleted === false) {
            Dump.updateOne(query, { deleted: true }, (err) => {
                if (err)    console.log(err);
                else {
                    req.flash('success', 'Dump moved to trash');
                    res.send('DELETE request');
                }
            });
        } else {
            req.flash('success', 'Dump deleted')
            Dump.remove(query, (err) => {
                if (err)    console.log(err);
                else {
                    res.send('DELETE request');
                }
            });
        }
    });

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).render('unauthorized');
    }
}

function ensureDumpOwner(req, res, next) {
    Dump.findById(req.params.id, (err, dump) => {
        if (err)  console.log(err);
        else if (dump.uid != req.user._id) {
            res.status(401).render('unauthorized');
        } else {
            res.locals.dump = dump;
            next();
        }
    });
}

module.exports = router;