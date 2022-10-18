"use strict";
exports.__esModule = true;
var express = require("express");
var http = require("http");
var socket_io_1 = require("./socket.io/socket_io");
var app = express();
var http_server = http.createServer(app);
(0, socket_io_1["default"])(http_server);
app.use(express.static('../dist/video-call'));
app.get('/', function (req, res) {
    res.sendFile(__dirname, '/index.html');
});
http_server.listen(4000, function () {
    console.log('Server started on port 4000');
});
