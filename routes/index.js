const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

router.get('/pass/:passwd', async (req, res) => {
    const { passwd } = req.params;

    try {
        const hashedPass = await bcrypt.hash(passwd, 10);
        return res.json({ status: 200, data: hashedPass });
    }
    catch(err) {
        return res.json({ status: 500, data: 'Error' });
    }
});

router.get('/', (req, res) => {
    res.render('login', { user_name: req.sessionID });
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/login', (req, res) => {
    const { uname, password } = req.body;
    console.log('uname: ' + uname);
    console.log('password:' + password);
    res.send('Ok');
});

module.exports = router;