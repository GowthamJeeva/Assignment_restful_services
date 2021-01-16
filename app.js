const express = require('express');
const cors = require('cors');
const app = express();
const userRoute = require('./routes/routes');
const validateToken = require('./auth/auth');
app.use(express.json());
app.use(cors({}));
// app.use((req, res, next) => {
//     if (req.url == '/sign-up' || req.url == '/login' || req.url == '/forgot-password' || req.url == '/password-reset') {
//         next();
//     } else {
//         console.log('ajkbsfkhjas');
//         app.use(validateToken.validateToken); 
//     }
// })
app.use(userRoute);
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Authorization');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Accept', 'application/json');
    next();
});

module.exports = app;