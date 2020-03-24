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
                res.render('viewTicket', { loggedIn: isLoggedIn, username: uname, ticketInfo});
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


router.post('/add', async (req, res) => {
    const { ticket_title, ticket_body } = req.body;
    const { isLoggedIn, uid, uname } = req;

    res.redirect('/');
});

module.exports = router;