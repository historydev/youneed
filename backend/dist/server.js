"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, './.env') });
const socket_io_1 = require("./src/socket.io/socket_io");
const cors = require("cors");
const fs = require("fs");
const express_json_validator_middleware_1 = require("express-json-validator-middleware");
const validator_controller_1 = require("./src/controllers/validator.controller");
const jwt_authentication_controller_1 = require("./src/controllers/jwt_authentication.controller");
const messages_controller_1 = require("./src/controllers/messages.controller");
const message_controller_1 = require("./src/controllers/message.controller");
const register_controller_1 = require("./src/controllers/register.controller");
const authentication_controller_1 = require("./src/controllers/authentication.controller");
const ExpressBrute = require("express-brute");
const users_controller_1 = require("./src/controllers/users.controller");
const meetings_controller_1 = require("./src/controllers/meetings.controller");
const app = express();
const http_server = http.createServer(app);
(0, socket_io_1.default)(http_server);
const { validate } = new express_json_validator_middleware_1.Validator({});
const schema = (file_path) => JSON.parse(fs.readFileSync(__dirname + '/src/models' + file_path).toString());
const brute_force_defense = (options) => {
    const store = new ExpressBrute.MemoryStore();
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
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: path.resolve(__dirname, '../dist') });
});
app.post('/user', (req, res) => {
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
http_server.listen(4000, () => {
    console.log('Server started on port 4000');
});
//# sourceMappingURL=server.js.map