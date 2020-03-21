const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    const { isLoggedIn, uname } = req;

    res.render('index', { loggedIn:  isLoggedIn, username: uname });
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