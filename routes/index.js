const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    try {
        const resp = await db.sendQuery('SELECT id, Title FROM Posts');
        return res.json({ status: 200, data: resp });
    }
    catch(err) {
        console.log(`${err}`);
        res.json({ status: 500, message: `${err}` });
    }
});

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

router.get('/pass', (req, res) => {
    res.render('login', { user_name: req.sessionID });
});

module.exports = router;