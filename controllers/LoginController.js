const db = require('../config/db');
const logger = require('../config/logger');
const bcrypt = require('bcrypt');

const salt_rounds = 10;

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
const createSession = async (userInfo) => {
    if(userInfo) {
        try {
            const { username, sessionID, uid } = userInfo;
            await db.sendQuery(`INSERT INTO Session (sid, skey, uid) VALUES ('${username}', 
            '${sessionID}', ${uid}) 
            ON DUPLICATE KEY UPDATE skey = '${sessionID}'`);
            return true;
        }
        catch(err) {
            const date = new Date();
            logger.serverLog(`${err} : ${date.toString()}`);
            return false;
        }
    }
}

const login = async (userInfo) => {
    const { username, password } = userInfo;

    if(!username || !password)
        return false;

    try {
        username = username.replace(/[\'\\]/g, '');
        const dbSearch = await db.sendQuery(`SELECT * FROM Users WHERE user_name = '${username}'`);

        if(dbSearch.length === 0)
            return false;
        
        const match = await bcrypt.compare(password, dbSearch[0].user_password);

        if(match)
            return true;
        else
            return false;
    }
    catch(err) {
        const date = new Date();
        logger.serverLog(`${err} : ${date.toString()}`);
        return false;
    }
}

const register = async (userInfo) => {
    const {
        user_name,
        user_mail,
        user_password
    } = userInfo;

    if(!user_name || !user_mail || !user_password)
        return false;

    try {
        const hashedPassword = await bcrypt.hash(user_password, salt_rounds);
        user_name = user_name.replace(/[\'\\]/g, '');
        await db.sendQuery(`INSERT INTO Users (user_name, user_mail, user_password)
        VALUES (
            '${user_name}', '${user_mail}', '${hashedPassword}'
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
    isLoggedIn,
    createSession,
    login,
    register
};