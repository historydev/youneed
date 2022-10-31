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
import {jwt_authenticationController} from "./src/controllers/jwt_authentication.controller";
import {basic_authenticationController} from "./src/controllers/basic_authentication.controller";
import {messages_controller} from "./src/controllers/messages.controller";
import {message_controller} from "./src/controllers/message.controller";
import {register_controller} from "./src/controllers/register.controller";
import {authentication_controller} from "./src/controllers/authentication.controller";

const app = express();
const http_server = http.createServer(app);
socket_io_listener(http_server);

const { validate } = new Validator({});
const schema = (file_path: string) => JSON.parse(fs.readFileSync(__dirname + '/src/models' + file_path).toString());

app.use(express.static('../dist/video-call'));
app.use(express.json());
app.use(cors({
	origin: ['http://localhost:4200'],
	exposedHeaders: ['Authentication']
}));

app.use(basic_authenticationController);
app.use('/messages', jwt_authenticationController);

app.get('*', (req, res) => {
	res.sendFile(__dirname, '/index.html');
});

app.post('/test', (req, res) => {
	JSON.parse(req.body.hack);
});
//app.post('/users', validate())
app.post('/auth', validate({body: schema('/authorization/authorization_input.schema.json')}), authentication_controller);
app.post('/register', validate({body: schema('/authorization/register_input.schema.json')}), register_controller);
app.post('/messages', messages_controller);
app.post('/message', message_controller);
app.use(validation_middleware);
http_server.listen(4000, () => {
	console.log('Server started on port 4000');
});
