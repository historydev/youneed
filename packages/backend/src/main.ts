import express from 'express';
import * as http from "http";
import * as path from "path";
import * as dotenv from 'dotenv';
dotenv.config({path: path.resolve(__dirname, './.env')});
import socket_io_listener from "./socket.io/socket_io";
import cors from 'cors';
import * as fs from "fs";
import {Validator} from "express-json-validator-middleware";
import {validation_middleware} from "./controllers/validator.controller";
import {jwt_authentication_controller} from "./controllers/jwt_authentication.controller";
import {basic_authentication_controller} from "./controllers/basic_authentication.controller";
import {messages_controller} from "./controllers/messages.controller";
import {message_controller} from "./controllers/message.controller";
import {register_controller} from "./controllers/register.controller";
import {authentication_controller} from "./controllers/authentication.controller";
import ExpressBrute from 'express-brute';
import {users_controller} from "./controllers/users.controller";
import {meetings_controller} from "./controllers/meetings.controller";
import {user_controller} from "./controllers/user.controller";
import {CallController} from "./controllers/call.controller";
import {query} from './databases/mongodb';
import AuthReqSchema from "./models/controllers/authentication/request.schema.json";
import RegReqSchema from "./models/controllers/register/request.schema.json";

const port = process.env.PORT;

const mongo_data = async(name: string) => {
	const calls = await query(name);
	return {
		collection: await calls.collection,
		client: await calls.client
	}
}

(async function() {

	const app = express();
	const http_server = http.createServer(app);
	socket_io_listener(http_server);

	const { validate } = new Validator({});
	const schema = (file_path: string) => JSON.parse(fs.readFileSync(__dirname + '/models' + file_path).toString());

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
// app.use(basic_authentication_controller);
	app.use(jwt_authentication_controller);

	app.use('/auth', brute_force_defense({freeRetries: 1}));
// app.use('/call', brute_force_defense({freeRetries: 1}));
	app.use('/register', brute_force_defense({freeRetries: 1}));
	app.use('/messages', brute_force_defense({freeRetries: 80}));


	new CallController(
		app,
		{
			name: '/call',
			params: [
				'meeting_id?',
				'limit?',
				'last?'
			]
		},
		await mongo_data('calls'),
		{
			// 'post': validate({body: schema('/controllers/authentication/request.schema.json')}),
		}
	);

	app.post('/user', user_controller);
	app.post('/meetings', meetings_controller)
	app.post('/users', users_controller);
	// @ts-ignore
	app.post('/auth', validate({body: AuthReqSchema}), authentication_controller);
	// @ts-ignore
	app.post('/register', validate({body: RegReqSchema}), register_controller);
	app.post('/messages', messages_controller);
	app.post('/message', message_controller);
	app.use(validation_middleware);


	http_server.listen(port, () => {
		console.log(`You-Need server listening on port: ${port}`);
	});

})();
