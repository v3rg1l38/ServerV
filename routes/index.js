const express = require('express');
const router = express.Router();
const loginSys = require('../controllers/LoginController');

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

router.post('/register', async (req, res) => {
    const { user_name, 
        user_password,
        user_password1,
        user_mail
     } = req.body;

     if(user_password !== user_password1)
        res.render('register', { loggedIn: req.isLoggedIn, rspMsg: 'Passwords do not match' });
    else
        res.render('register', { loggedIn: req.isLoggedIn, rspMsg: 'You have been registered' });
});

module.exports = router;