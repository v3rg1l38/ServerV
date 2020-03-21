const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const loginCheck = require('../controllers/LoginController').isLoggedIn;
const login = require('../controllers/LoginController').login;

router.get('/', loginCheck, async (req, res) => {
    const user = {
        username: 'v3rg1l38',
        sessionID: req.sessionID
    };

    await login(user);
    res.render('login', { loggedIn: req.isLoggedIn, username: req.uname});
});

router.get('/login', (req, res) => {
    res.render('login', { loggedIn: false, username: 'v3rg1l' });
});

router.get('/register', (req, res) => {
    res.render('register', { loggedIn: false });
});

router.post('/login', (req, res) => {
    const { uname, password } = req.body;
    console.log('uname: ' + uname);
    console.log('password: ' + password);
    res.redirect('/login');
});

module.exports = router;