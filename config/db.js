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
                const nerr = new Error(`[ERROR:getConnection]: ${err}`);
                reject(nerr);
            }
            else {
                connection.query(sql, (err, result) => {
                    if(err) {
                        const date = new Date();
                        logger.serverLog(`[ERROR:sendQuiery]: ${err} : ${date.toString()}`);
                        const nerr = new Error(`[ERROR:sendQuery]: ${err}`);
                        reject(nerr);
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