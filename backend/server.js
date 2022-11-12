"use strict";
exports.__esModule = true;
var express = require("express");
var http = require("http");
var path = require("path");
var dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, './.env') });
var socket_io_1 = require("./src/socket.io/socket_io");
var cors = require("cors");
var fs = require("fs");
var express_json_validator_middleware_1 = require("express-json-validator-middleware");
var validator_controller_1 = require("./src/controllers/validator.controller");
var jwt_authentication_controller_1 = require("./src/controllers/jwt_authentication.controller");
var messages_controller_1 = require("./src/controllers/messages.controller");
var message_controller_1 = require("./src/controllers/message.controller");
var register_controller_1 = require("./src/controllers/register.controller");
var authentication_controller_1 = require("./src/controllers/authentication.controller");
var ExpressBrute = require("express-brute");
var users_controller_1 = require("./src/controllers/users.controller");
var meetings_controller_1 = require("./src/controllers/meetings.controller");
var app = express();
var http_server = http.createServer(app);
(0, socket_io_1["default"])(http_server);
var validate = new express_json_validator_middleware_1.Validator({}).validate;
var schema = function (file_path) { return JSON.parse(fs.readFileSync(__dirname + '/src/models' + file_path).toString()); };
var brute_force_defense = function (options) {
    var store = new ExpressBrute.MemoryStore();
    return new ExpressBrute(store, options).prevent;
};
app.use(express.static(path.resolve(__dirname, '../dist')));
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:4200'],
    exposedHeaders: ['Authentication']
}));
app.use('/auth', brute_force_defense({ freeRetries: 1 }));
app.use('/register', brute_force_defense({ freeRetries: 1 }));
app.use('/messages', brute_force_defense({ freeRetries: 80 }));
// app.use(basic_authentication_controller);
app.use(jwt_authentication_controller_1.jwt_authentication_controller);
app.get('*', function (req, res) {
    res.sendFile('index.html', { root: path.resolve(__dirname, '../dist') });
});
app.post('/user', function (req, res) {
    res.send(res.locals['user']);
    res.end();
});
app.post('/meetings', meetings_controller_1.meetings_controller);
app.post('/users', users_controller_1.users_controller);
app.post('/auth', validate({ body: schema('/authentication/authorization_input.schema.json') }), authentication_controller_1.authentication_controller);
app.post('/register', validate({ body: schema('/authentication/register_input.schema.json') }), register_controller_1.register_controller);
app.post('/messages', messages_controller_1.messages_controller);
app.post('/message', message_controller_1.message_controller);
app.use(validator_controller_1.validation_middleware);
http_server.listen(4000, function () {
    console.log('Server started on port 4000');
});
