import * as express from 'express';
import * as http from "http";
import * as path from "path";
import * as dotenv from 'dotenv';
dotenv.config({path: path.resolve(__dirname, './.env')});
import socket_io_listener from "./src/socket.io/socket_io";
import * as cors from 'cors';
import * as fs from "fs";
import {Validator} from "express-json-validator-middleware";
import {validation_middleware} from "./src/controllers/validator.controller";
import {jwt_authentication_controller} from "./src/controllers/jwt_authentication.controller";
import {basic_authentication_controller} from "./src/controllers/basic_authentication.controller";
import {messages_controller} from "./src/controllers/messages.controller";
import {message_controller} from "./src/controllers/message.controller";
import {register_controller} from "./src/controllers/register.controller";
import {authentication_controller} from "./src/controllers/authentication.controller";
import * as ExpressBrute from 'express-brute';
import {users_controller} from "./src/controllers/users.controller";
import {meetings_controller} from "./src/controllers/meetings.controller";

const app = express();
const http_server = http.createServer(app);
socket_io_listener(http_server);

const { validate } = new Validator({});
const schema = (file_path: string) => JSON.parse(fs.readFileSync(__dirname + '/src/models' + file_path).toString());

const brute_force_defense = (options: ExpressBrute.Options) => {
	const store = new ExpressBrute.MemoryStore();
	return new ExpressBrute(store, options).prevent;
}

app.use(express.static(path.resolve(__dirname, '../dist')));
app.use(express.json());
app.use(cors({
	origin: ['http://localhost:4200'],
	exposedHeaders: ['Authentication']
}));

app.use('/auth', brute_force_defense({freeRetries: 1}));
app.use('/register', brute_force_defense({freeRetries: 1}));
app.use('/messages', brute_force_defense({freeRetries: 80}));

// app.use(basic_authentication_controller);
app.use(jwt_authentication_controller);

app.get('*', (req, res) => {
	res.sendFile('index.html', {root: path.resolve(__dirname, '../dist')});
});

app.post('/user', (req, res) => {
	res.send(res.locals['user']);
	res.end();
});

app.post('/meetings', meetings_controller)
app.post('/users', users_controller);
app.post('/auth', validate({body: schema('/authentication/authorization_input.schema.json')}), authentication_controller);
app.post('/register', validate({body: schema('/authentication/register_input.schema.json')}), register_controller);
app.post('/messages', messages_controller);
app.post('/message', message_controller);
app.use(validation_middleware);
http_server.listen(4000, () => {
	console.log('Server started on port 4000');
});
