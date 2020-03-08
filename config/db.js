const MySql = require('mysql');
const logger = require('./logger');

let _connection;

const setConnection = (options) => {
    _connection = MySql.createPool(options);
}

const sendQuery = (sql) => {
    return new Promise((resolve, reject) => {
        _connection.getConnection((err, connection) => {
            if(err) {
                const date = new Date();
                logger.serverLog(`[ERROR:sendQuery]: ${err} : ${date.toString()}`);
                reject(err);
            }
            else {
                connection.query(sql, (err, result) => {
                    if(err) {
                        const date = new Date();
                        logger.serverLog(`[ERROR:sendQuery]: ${err} : ${date.toString()}`);
                        reject(err);
                    }
                    else {
		                connection.release();
                        resolve(result);
		            }
                });
            }
        });
    });
}

module.exports = {
    setConnection,
    sendQuery
}