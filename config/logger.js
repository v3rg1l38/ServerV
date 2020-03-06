const fs = require('fs');

const loginLogs = './Logs/login.log';
const serverLogs = './Logs/server.log';

const loginLog = (log) => {
    log += '\n';
    fs.appendFile(loginLogs, log, 'utf-8', (err) => {
        if(err)
            console.log(`[Error:loginLog]: ${err}`);
    });
}

const serverLog = (log) => {
    log += '\n';
    fs.appendFile(serverLogs, log, 'utf-8', (err) => {
        if(err)
            console.log(`[Error:serverLog]: ${err}`);
    });
}


module.exports = {
    loginLog,
    serverLog
}