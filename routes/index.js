const express = require('express');
const router = express.Router();
const loginSys = require('../controllers/LoginController');
const logger = require('../config/logger');
const ticketSystem = require('../controllers/TicketController');
const db = require('../config/db');

router.get('/', async (req, res) => {
    const { isLoggedIn, uname, uid, role } = req;

    if(isLoggedIn) {
        try {
            let tickets;
            if(role !== 'ADMIN')
                tickets = await ticketSystem.getTickets(uid);
            else
                tickets = await ticketSystem.getTickets('All');

            res.render('index', { loggedIn: isLoggedIn, username: uname,
            tickets });
        }
        catch(err) {
            const date = new Date();
            logger.serverLog(`${err} : ${date.toString()}`);
            res.redirect('/');
        }
    }
    else
        res.redirect('/login');
});

router.get('/addticket', (req, res) => {
    const { isLoggedIn, uname, uid } = req;

    if(isLoggedIn)
        res.render('addticket', { loggedIn: isLoggedIn, username: uname });
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
        const userInfo = await loginSys.login(user);
        
        if(userInfo) {
            user.uid = userInfo.user_id;
            user.sessionID = req.sessionID;
            user.role = userInfo.role;

            const success = await loginSys.createSession(user);

            if(success)
                return res.redirect('/');
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
            const clear_username = user_name.replace(/[\'\\]/g, '');
            const userExist = await db.sendQuery(`SELECT user_name FROM Users WHERE user_name = '${clear_username}'`);

            if(userExist.length !== 0)
                return res.render('register', { rspMsg: 'User already exist!' });

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