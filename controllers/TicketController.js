const db = require('../config/db');
const logger = require('../config/logger');

const getTickets = async (userID) => {
    if(!userID)
        return false;

    try {
        let tickets;
        
        if(userID !== 'All') {
            tickets = await db.sendQuery(`
            SELECT Users.user_name, Ticket.ticket_title, Ticket.ticket_id 
            FROM Ticket JOIN Users
            ON Ticket.ticket_owner = Users.user_id WHERE Users.user_id = ${userID}`);
        }
        else {
            tickets = await db.sendQuery(`
            SELECT Users.user_name, Ticket.ticket_title, Ticket.ticket_id 
            FROM Ticket JOIN Users
            ON Ticket.ticket_owner = Users.user_id`);            
        }

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

const getTicket = async (ticketID) => {
    if(!ticketID)
        return false;

    try {
        const ticket = await db.sendQuery(`SELECT Ticket.ticket_id, Ticket.ticket_title, Ticket.ticket_body, Ticket.ticket_status,
        Ticket.ticket_owner, Users.user_name
        FROM Ticket JOIN Users ON Ticket.ticket_owner = Users.user_id
         WHERE ticket_id = ${ticketID}`);
        
        if(ticket.length > 0)
            return ticket[0];
        else
            return false;
    }
    catch(err) {
        const date = new Date();
        logger.serverLog(`${err} : ${date.toString()}`);
        return false;
    }
}

const addTicket = async (ticketInfo) => {
    if(!ticketInfo)
        return false;

    try {
        const { ticket_title, ticket_body, uid } = ticketInfo;
        const clear_title = ticket_title.replace(/[\'\\]/g, '');
        const clear_body = ticket_body.replace(/[\'\\]/g, '');

        await db.sendQuery(`
        INSERT INTO Ticket (ticket_owner, ticket_title, ticket_body)
        VALUES (
            ${uid},
            '${clear_title}',
            '${clear_body}'
        )`);

        return true;
    }
    catch(err) {
        const date = new Date();
        logger.serverLog(`${err} : ${date.toString()}`);
        return false;
    }
}

module.exports = {
    getTickets,
    addTicket,
    getTicket
};