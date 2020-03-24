const logger = require('../config/logger');
const db = require('../config/db');

const getAllTickets = async () => {
    try {
        const resp = await db.sendQuery('SELECT Users.user_name, Ticket.ticket_title FROM Ticket JOIN Users ON Ticket.ticket_owner = Users.user_id');
        return true;
    }
    catch(err) {
        const date = new Date();
        logger.serverLog(`${err} : ${date.toString()}`);
        return false;
    }
}

module.exports = getAllTickets;