const express = require('express');
const path = require('path');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const { check, validationResult } = require('express-validator');
const { userValidationRules, validate } = require('../validator.js');

// Load the model
let User = require('../models/user');

router.use(express.static(path.join(__dirname, '../static')));


router.route('/register')
    .get((req, res) => {
        res.sendFile(path.join(__dirname, "../static/register.html"));
    })
    .post(userValidationRules(), validate, (req, res) => {
        const name = req.body.name;
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;

        let newUser = new User({
            name,
            email,
            username,
            password
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
                            res.redirect('/users/login');
                        }
                    });
                }
            });
        });
    });

router.route('/login')
    .get((req, res) => {
        res.sendFile(path.join(__dirname, "../static/login.html"));
    })
    .post((req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/dumps',
            failureRedirect: '/users/login/',
            failureFlash: true
        })(req, res, next);
    });

module.exports = router;