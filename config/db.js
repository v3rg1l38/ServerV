const fs = require('fs');
const MySql = require('mysql');
const logger = require('./logger');
const credFile = './config/login.json';

class Database {
    constructor() {       
        this._connection = null;
        this.login();
    }

    login() {
        fs.readFile(credFile, 'utf8', (err, data) => {
            if(err)
                console.log(err);
            else {
                data = JSON.parse(data);
                this._connection = MySql.createPool(data);
                this._connection.getConnection((err, conn) => {
                    if(err) {
                        const date = new Date();
                        logger.serverLog(`[ERROR:loginDB]: ${err} : ${date.toString()}`);
                        console.log(`[ERROR:loginDB]: ${err}`);
                    }
                    else {
                        console.log('Connected To Database!');
                        conn.release();
                    }
                });
            }
        });
    }

    sendQuery(sql) {
        return new Promise((resolve, reject) => {
            this._connection.getConnection((err, connection) => {
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

    async addPost(title, body, picture, category)
    {
        let sql;
        body = body.replace(/[\'\\]/g, '');
        title = title.replace(/[\'\\/]/g, '');
        
        if(!picture) {
            sql = `INSERT INTO Posts (Title, Body, Category) VALUES ('${title}', '${body}', '${category}')`;
        }
        else {
            sql = `INSERT INTO Posts (Title, Body, Picture, Category) VALUES ('${title}', '${body}', '${picture}', '${category}')`;
        }
            
        try {
            const response = await this.sendQuery(sql);
            return response;
        }
        catch(err) {
            const date = new Date();
            logger.serverLog(`[ERROR:addPost]: ${err} : ${date.toString()}`);
            console.log(`[ERROR:addPost]: ${err}`);
        }
    }

    async addUser(username, email, password) {
        const sql = `INSERT INTO Users (Username, Email, Password) VALUES ('${username}', '${email}', '${password}')`;

        try {
            const response = await this.sendQuery(sql);
            return response;
        }
        catch(err) {
            const date = new Date();
            logger.serverLog(`[ERROR:addUser]: ${err} : ${date.toString()}`);
            console.log(`[ERROR]: ${err}`);
        }
    }

    async editPost(oldtitle, title, body, picture, category) {
        const sql = `UPDATE Posts SET Title = '${title}',
            Body = '${body}',
            Picture = '${picture}',
            Category = '${category}'
            WHERE Title = '${oldtitle}'`;

        try {
            const response = await this.sendQuery(sql);
            return response;
        }
        catch(err) {
            const date = new Date();
            logger.serverLog(`[ERROR:EditPost]: ${err} : ${date.toString()}`);
            console.log(`[ERROR:EditPost]: ${err}`);
        }
    }

    async deletePost(Title) {
        const sql = `DELETE FROM Posts WHERE Title = '${Title}'`;

        try {
            const response = await this.sendQuery(sql);
            return response;
        }
        catch(err) {
            const date = new Date();
            logger.serverLog(`[ERROR:DeletePost]: ${err} : ${date.toString()}`);
            console.log(`[ERROR:DeletePost]: ${err}`);
        }
    }
}

module.exports = Database;