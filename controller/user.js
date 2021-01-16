const fs = require('fs');
const casssandra_ddl = require('./../utils/db/cassandra/cassandra_ddl');
const cassandra_client = require('./../utils/db/cassandra/cassandra_client');
htmlRegistrationTemplate = fs.readFileSync('./templates/forgot-password.html', 'utf8'),
ejs = require('ejs');
const btoa = require('btoa');
const mail = require('./../utils/mail');
const jwt = require('jsonwebtoken-refresh');
const config = require('./../config/config');

const createUser = (req, res, next) => {
    let body = req.body.data;
    
    let query = casssandra_ddl.insert.user;
    let params = [body.firstname || '', body.lastname || '', body.email || '', body.password || '', body.mobile_number || ''];
    cassandra_client.dbQuery(query, params, (err, data) => {
        if (err) {
            console.log(`Error in inserting the user data${JSON.stringify(err)}`);
            res.status(500);
            res.send({"status": false,"message":"Not created. Try after some time"});
        } else {
            res.status(200);
            res.send({"status": true, "message":"User registered successfully"});
        }
    })
}

const login = (req, res, next) => {
    let body = req.body.data;
    let query = casssandra_ddl.select.fetchUser;
    let params = [body.email, body.password];
    cassandra_client.dbQuery(query, params, (err, data) => {
        if (err) {
            console.log(`Error in fetching user ${JSON.stringify(err)}`);
            res.status(500);
            res.send({"status": false, "message": "User not fetched. Try after some time"});
        } else if (data) {
            if  (data.rows.length == 0) {
                res.status(200);
                res.send({"status": false, "message": "Email/Password wrong"});
            } else if (data.rows.length == 1) {
                const authToken = jwt.sign(data.rows[0], config.secret, {
                    expiresIn: config.expireTime
                } )
                res.status(200);
                res.send({"status": true, "message": "Login Success", "data": data.rows, authToken: authToken});
            }
        }
    })
}

const sendMailPasswordReset = (req, res, next) => {
    let body = req.body.data;
    let query = casssandra_ddl.select.checkUser;
    let params = [body.email];
    cassandra_client.dbQuery(query, params, (err, data) => {
        if (err) {
            console.log(`Error in checking the user ${JSON.stringify(err)}`);
            res.status(500);
            res.send({"status": false, "message": "User not fetched. Try after some time"});
        } else if (data) {
            if (data.rows.length == 0) {
                res.status(200);
                res.send({"status": false, "message": "User not available"});
            } else if (data.rows.length == 1) {
                query = casssandra_ddl.update.updatePassword;
                params = [body.password, body.email];
                const btoaEmail = btoa(body.email);
                const authToken = jwt.sign(data.rows[0], config.secret, {
                    expiresIn: config.expireTime
                } )
                let html = ejs.render(htmlRegistrationTemplate, {name: data.rows[0].firstname, email: btoaEmail, url: config.FE_URL, authToken: authToken});
                mail.sendMail([body.email], "Welcome to LoginX", html);
                cassandra_client.dbQuery(query, params, (error, rows) => {
                    if (error) {
                        console.log(`Error in checking the user ${JSON.stringify(error)}`);
                        res.status(500);
                        res.send({"status": false, "message": "Servor error. Try after some time"});
                    } else if (rows) {
                        res.status(200);
                        res.send({"status": true, "message": "Email Sent successfully"});
                    }
                })
            }
        }
    })

}

const updatePassword = (req, res, next) => {
    let body = req.body.data;
    let query = casssandra_ddl.select.checkUser;
    let params = [body.email];
    cassandra_client.dbQuery(query, params, (err, data) => {
        if (err) {
            console.log(`Error in checking the user ${JSON.stringify(err)}`);
            res.status(500);
            res.send({"status": false, "message": "User not fetched. Try after some time"});
        } else if (data) {
            if (data.rows.length == 0) {
                res.status(200);
                res.send({"status": false, "message": "Email/mobile_number wrong"});
            } else if (data.rows.length == 1) {
                query = casssandra_ddl.update.updatePassword;
                params = [body.password, body.email];
                // const btoaEmail = btoa(body.email);
                // let html = ejs.render(htmlRegistrationTemplate, {name: data.rows[0].firstname, email: btoaEmail});
                // mail.sendMail([body.email], "Welcome to LoginX", html);
                cassandra_client.dbQuery(query, params, (error, rows) => {
                    if (error) {
                        console.log(`Error in checking the user ${JSON.stringify(error)}`);
                        res.status(500);
                        res.send({"status": false, "message": "Password not updated. Try after some time"});
                    } else if (rows) {
                        res.status(200);
                        res.send({"status": true, "message": "Password updated successfully"});
                    }
                })
            }
        }
    })

}

module.exports = {
    signUp: createUser,
    checkUser: login,
    forgetPassword: updatePassword,
    sendMailPasswordReset: sendMailPasswordReset
}