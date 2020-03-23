const express = require('express');
const router = express.Router();
const loginSys = require('../controllers/LoginController');
const logger = require('../config/logger');

router.get('/', async (req, res) => {
    const { isLoggedIn, uname } = req;

    res.render('index');
});

router.get('/login', (req, res) => {
    res.render('login', { loggedIn: false, username: 'v3rg1l' });
});

router.get('/register', (req, res) => {
    res.render('register', { loggedIn: req.isLoggedIn, username: req.username });
});

router.post('/register', async (req, res) => {
    const { user_name, 
        user_password,
        user_password1,
        user_mail
     } = req.body;

     if(user_password !== user_password1)
        res.render('register', { loggedIn: req.isLoggedIn, rspMsg: 'Passwords do not match' });
    else {
        const userInfo = {
            user_name,
            user_password,
            user_mail
        };

        try {
            const success = await loginSys.register(userInfo);

            if(success)
                res.render('register', { loggedIn: false, rspMsg: 'You have been successfully registered!' });
            else
                res.render('register', { loggedIn: false, rspMsg: 'Something went wrong' });
        }
        catch(err) {
            const date = new Date();
            logger.serverLog(`${err} : ${date.toString()}`);
            res.render('register', { loggedIn: false, rspMsg: `${err}` });
        }
    }
});

module.exports = router;