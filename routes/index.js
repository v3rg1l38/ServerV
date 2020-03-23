const express = require('express');
const router = express.Router();
const loginSys = require('../controllers/LoginController');
const logger = require('../config/logger');

router.get('/', async (req, res) => {
    const { isLoggedIn, uname } = req;

    if(isLoggedIn)
        res.render('index', { loggedIn: isLoggedIn, username: uname});
    else
        res.redirect('/login');
});

router.get('/login', (req, res) => {
    const { isLoggedIn } = req;
    if(!isLoggedIn)
        res.render('login');
    else
        res.redirect('/');
});

router.post('/login', async (req, res) => {
    const { user_name, user_password } = req.body;

    if(!user_name || !user_password)
        return res.render('login', { rspMsg: 'You have to enter Username and Password' });

    const user = {
        user_name,
        user_password
    };

    try {
        const userID = await loginSys.login(user);
        
        if(userID) {
            user.uid = userID;
            user.sessionID = req.sessionID;

            const success = await loginSys.createSession(user);

            if(success)
                return res.render('index', { loggedIn: true, username: user_name });
            else
                return res.render('login', { rspMsg: 'Something went wrong!' });
        }
        else {
            res.render('login', { rspMsg: 'Wrong Username or Password' });
        }
    }
    catch(err) {
        const date = new Date();
        logger.serverLog(`${err} : ${date.toString()}`);
        return res.render('login', { rspMsg: 'Something went wrong!' });
    }
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

router.get('/logout', async (req, res) => {
    const { sessionID } = req;

    try {
        const success = await loginSys.logout(sessionID);
        
        if(success)
            return res.render('login', { loggedIn: false, rspMsg: 'You have been logged out!' });
        else
            return res.render('login', { loggedIn: false, rspMsg: 'Something went wrong!'} );
    }
    catch(err) {
        const date = new Date();
        logger.serverLog(`${err} : ${date.toString()}`);
        res.render('login', { loggedIn: false, rspMsg: 'Something went wrong!' });
    }
});

module.exports = router;