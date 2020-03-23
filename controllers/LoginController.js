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
            req.uid = result[0].uid;
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
            const { user_name, sessionID, uid } = userInfo;
            await db.sendQuery(`INSERT INTO Session (sid, skey, uid) VALUES ('${user_name}', 
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
    const { user_name, user_password } = userInfo;

    if(!user_name || !user_password)
        return false;

    try {
        const clear_username = user_name.replace(/[\'\\]/g, '');
        const dbSearch = await db.sendQuery(`SELECT * FROM Users WHERE user_name = '${clear_username}'`);

        if(dbSearch.length === 0)
            return false;

        const match = await bcrypt.compare(user_password, dbSearch[0].user_password);

        if(match)
            return dbSearch[0].user_id;
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
        const clear_user_name = user_name.replace(/[\'\\]/g, '');
        const userExist = await db.sendQuery(`SELECT user_id FROM Users WHERE user_name = '${clear_user_name}'`);

        if(userExist.length > 0)
            return false;

        const hashedPassword = await bcrypt.hash(user_password, salt_rounds);
        await db.sendQuery(`INSERT INTO Users (user_name, user_mail, user_password)
        VALUES (
            '${clear_user_name}', '${user_mail}', '${hashedPassword}'
        )`);

        return true;
    }
    catch(err) {
        const date = new Date();
        logger.serverLog(`${err} : ${date.toString()}`);
        return false;
    }
}

const logout = async (sessionID) => {
    if(!sessionID)
        return false;

    try {
        await db.sendQuery(`DELETE FROM Session WHERE skey = '${sessionID}'`);
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
    register,
    logout
};