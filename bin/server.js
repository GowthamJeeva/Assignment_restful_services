"use strict";

const http = require('http');

const app = require('./../app');
const port = 3000;
app.set('port', port);
const server = http.createServer(app);

server.listen(port, function () {
    console.log("----------server started------------");
  });
  server.on('error', function () {
      console.log("Error in starting the server")
  });