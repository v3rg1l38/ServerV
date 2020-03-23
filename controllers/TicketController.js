const db = require('../config/db');
const logger = require('../config/logger');

const getTickets = async (userID) => {
    if(!userID)
        return false;

    try {
        const tickets = await db.sendQuery(`
        SELECT Users.user_name, Ticket.ticket_title 
        FROM Ticket JOIN Users
        ON Ticket.ticket_owner = Users.user_id WHERE Users.user_id = ${userID}`);

        if(tickets.length === 0)
            return false;
        else
            return tickets;
    }
    catch(err) {
        const date = new Date();
        logger.serverLog(`${err} : ${date.toString()}`);
        return false;
    }
}

module.exports = {
    getTickets
};