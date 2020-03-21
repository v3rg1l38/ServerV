const db = require('../config/db');
const logger = require('../config/logger');

const isLoggedIn = async (req, res, next) => {
    const { id } = req.session;

    try {
        const result = await db.sendQuery(`SELECT * FROM Session WHERE skey = '${id}'`);

        if(result.length > 0) {
            req.isLoggedIn = true;
            req.uname   = result[0].sid;
            next();
        }
        else {
            req.isLoggedIn = false;
            next();
        }
    }
    catch(err) {
        const date = new Date();
        logger.serverLog(`${err} : ${date.toString()}`);
        res.json({ message: err});
    }
}

// userInfo = { username, sessionID }
const login = async (userInfo) => {
    if(userInfo) {
        try {
            const { username, sessionID } = userInfo;
            await db.sendQuery(`INSERT INTO Session (sid, skey) VALUES ('${username}', '${sessionID}') ON DUPLICATE KEY UPDATE skey = '${sessionID}'`);
            return true;
        }
        catch(err) {
            const date = new Date();
            logger.serverLog(`${err} : ${date.toString()}`);
            return false;
        }
    }
}

module.exports = {
    isLoggedIn,
    login
};