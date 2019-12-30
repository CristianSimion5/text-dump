const express = require('express');
const path = require('path');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const { check, validationResult } = require('express-validator');
const { userValidationRules, validate } = require('../validator.js');

// Load the model
let User = require('../models/user');

router.route('/register')
    .get((req, res) => {
        if (req.user)
            res.redirect('/dumps')
        else
            res.render('register',
            { title: "Register" });
    })
    .post(userValidationRules(), validate, (req, res) => {
        if (req.errors.errors.length > 0) {
            res.render('register.pug', {
                title: "Register",
                errors: req.errors.errors
            });
        } else {
            const name = req.body.name;
            const email = req.body.email;
            const username = req.body.username;
            const password = req.body.password;
            const joined = new Date();

            let newUser = new User({
                name,
                email,
                username,
                password,
                joined
            });
    
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) {
                        console.log(err);
                    } else {
                        newUser.password = hash;
                        newUser.save(err => {
                            if (err) {
                                console.log(err);
                            } else {
                                req.flash('success', 'You have successfully registered and are now able to log in.');
                                res.redirect('/users/login');
                            }
                        });
                    }
                });
            });
        }
    });

router.route('/login')
    .get((req, res) => {
        if (req.user)
            res.redirect('/dumps')
        else
            res.render('login',
            { title: "Login" });
    })
    .post((req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/dumps',
            failureRedirect: '/users/login/',
            failureFlash: true
        })(req, res, next);
    });

router.get('/data', (req, res) => {
    res.json(req.user);
});

// Logout
router.get('/logout', (req, res) => {
    if (req.user) {
        req.logout();
        req.flash('success', 'You have logged out');
    }
    res.redirect('/users/login');
});

module.exports = router;