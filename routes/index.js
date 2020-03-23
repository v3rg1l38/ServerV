const express = require('express');
const router = express.Router();
const loginSys = require('../controllers/LoginController');
const logger = require('../config/logger');

router.get('/', async (req, res) => {
    const { isLoggedIn, uname } = req;

    res.render('index', { loggedIn: isLoggedIn, username: uname});
});

router.get('/login', (req, res) => {
    const { isLoggedIn } = req;
    if(!isLoggedIn)
        res.render('login');
    else
        res.redirect('/');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { user_name, 
        user_password,
        user_password1,
        user_mail
     } = req.body;

     if(user_password !== user_password1)
        res.render('register', { rspMsg: 'Passwords do not match' });
    else {
        const userInfo = {
            user_name,
            user_password,
            user_mail
        };

        try {
            const success = await loginSys.register(userInfo);

            if(success)
                res.render('register', { rspMsg: 'You have been successfully registered!' });
            else
                res.render('register', { rspMsg: 'Something went wrong' });
        }
        catch(err) {
            const date = new Date();
            logger.serverLog(`${err} : ${date.toString()}`);
            res.render('register', { rspMsg: `${err}` });
        }
    }
});

module.exports = router;