const fs = require('fs');
const globals = require('./Globals');

class Logger {
    constructor() {}

    static loginLog(log) {
        log += '\n';
        fs.appendFile(globals.loginLogs, log, 'utf-8', (err) => {
            if(err)
                console.log(`[Error:loginLog]: ${err}`);
        });
    }

    static serverLog(log) {
        log += '\n';
        fs.appendFile(globals.serverLogs, log, 'utf-8', (err) => {
            if(err)
                console.log(`[Error:serverLog]: ${err}`);
        });
    }
}

module.exports = Logger;