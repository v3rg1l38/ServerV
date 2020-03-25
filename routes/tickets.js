const express = require('express');
const router = express.Router();
const logger = require('../config/logger');
const ticketSys = require('../controllers/TicketController');

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { isLoggedIn, uname, uid, role } = req;

    if(!isLoggedIn)
        res.redirect('/login');
    else {
        try {
            const ticketInfo = await ticketSys.getTicket(id);

            if(!ticketInfo)
                return res.redirect('/');
    
            if(uid === ticketInfo.ticket_owner || role === 'ADMIN')
                res.render('viewTicket', { loggedIn: isLoggedIn, username: uname, ticketInfo, role});
            else
                res.redirect('/');
        }
        catch(err) {
            const date = new Date();
            logger.serverLog(`${err} : ${date.toString()}`);
            res.redirect('/');
        }
    }
});

router.post('/delete', async (req, res) => {
    const { ticketID } = req.body;
    const { role, isLoggedIn } = req;

    if(ticketID && role === 'ADMIN' && isLoggedIn) {
        try {
            const success = await ticketSys.deleteTicket(ticketID);
            res.redirect('/');
        }
        catch(err) {
            const date = new Date();
            logger.serverLog(`${err} : ${date.toString()}`);
            console.error(`${err} : ${date.toString()}`);
        }
    }
    else {
        res.redirect('/');
    }
});

router.post('/add', async (req, res) => {
    const { ticket_title, ticket_body } = req.body;
    const { isLoggedIn, uid, uname } = req;

    if(!isLoggedIn)
        return res.redirect('/login');
    
    if(!ticket_title || !ticket_body)
        return res.render('addticket', { loggedIn: isLoggedIn, username: uname, rspMsg: 'You have to fill in all data!' });

    try {
        const ticketInfo = {
            ticket_title,
            ticket_body,
            uid
        }

        const success = await ticketSys.addTicket(ticketInfo);

        if(success)
            res.render('addticket', { loggedIn: isLoggedIn, username: uname, rspMsg: 'Ticket has been added!' });
        else
            res.render('addticket', { loggedIn: isLoggedIn, username: uname, rspMsg: 'Something went wrong!' });
    }
    catch(err) {
        const date = new Date();
        logger.serverLog(`${err} : ${date.toString()}`);
        res.render('addticket', { loggedIn: isLoggedIn, username: uname, rspMsg: 'Something went wrong!' });
    }
});

module.exports = router;