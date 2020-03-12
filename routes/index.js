const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/login', (req, res) => {
    res.render('login', { loggedIn: true, username: 'v3rg1l' });
});

router.get('/register', (req, res) => {
    res.render('register', { loggedIn: false });
});

router.post('/login', (req, res) => {
    const { uname, password } = req.body;
    console.log('uname: ' + uname);
    console.log('password:' + password);
    res.send('Ok');
});

module.exports = router;