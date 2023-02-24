import express from 'express';
import * as http from "http";
import * as path from "path";
import * as dotenv from 'dotenv';
dotenv.config({path: path.resolve(__dirname, '..', 'environment', '.env')});
import cors from 'cors';
import * as fs from "fs";
import {Validator} from "express-json-validator-middleware";
import {validation_middleware} from "./pipes/express-json-validator/validator.pipe";
import {
	JsonWebTokenAuthorizationPipe
} from "./pipes/authorization/jwt-authorization.pipe";
import {
	BasicAuthorizationPipe
} from "./pipes/authorization/basic-authorization.pipe";
import {messages_controller} from "./controllers/meetings/messages/messages.controller";
import {message_controller} from "./controllers/meetings/messages/message.controller";
import {register_controller} from "./controllers/registration/register.controller";
import {
	AuthenticationController
} from "./controllers/authentication/authentication.controller";
import ExpressBrute from 'express-brute';
import {users_controller} from "./controllers/experts-tape/users.controller";
import {MeetingsController} from "./controllers/meetings/meetings/meetings.controller";
import {user_controller} from "./controllers/users/user.controller";
import {CallsController} from "./controllers/meetings/calls/calls.controller";
import {query} from './databases/mongodb';
import AuthReqSchema from "./models/controllers/authentication/request.schema.json";
import RegReqSchema from "./models/controllers/register/request.schema.json";
import {Server} from "socket.io";
import socket_io from "./socket.io/socket_io";
import {JSONSchema7} from "json-schema";

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const app = express();
const http_server = http.createServer(app);

export const io = socket_io(
	new Server(
		http_server,
		{
			cors: {
				origin: HOST
			}
		}
	)
);

const mongo_data = async(name: string) => {
	const calls = await query(name);
	return {
		collection: await calls.collection,
		client: await calls.client
	}
}

(async function() {

	const { validate } = new Validator({});

	const brute_force_defense = (options: ExpressBrute.Options) => {
		const store = new ExpressBrute.MemoryStore();
		return new ExpressBrute(store, options).prevent;
	}

	const authorization = {
		jwt: new JsonWebTokenAuthorizationPipe(),
		basic: new BasicAuthorizationPipe()
	};

	app.use(express.static(path.resolve(__dirname, '../dist')));
	app.use(express.json());

	app.use(cors({
		origin: [HOST],
		exposedHeaders: ['Authentication']
	}));

	app.use(authorization.basic.checkRequest);
	app.use(authorization.jwt.checkRequest);

	app.use('/auth', brute_force_defense({freeRetries: 1}));
// app.use('/call', brute_force_defense({freeRetries: 1}));
	app.use('/register', brute_force_defense({freeRetries: 1}));
	// app.use('/messages', brute_force_defense({freeRetries: 80}));


	// new CallsController(
	// 	app,
	// 	{
	// 		name: '/call',
	// 		params: [
	// 			'meeting_id?',
	// 			'limit?',
	// 			'last?'
	// 		]
	// 	},
	// 	await mongo_data('calls'),
	// 	{
	// 		// 'post': validate({body: schema(path.resolve('/controllers/authentication/request.schema.json'))}),
	// 	}
	// );

	new MeetingsController(
		app,
		{
			name: '/meetings',
			params: [
				'count?',
				'last?'
			]
		},
		await mongo_data('meetings'),
		{}
	)

	app.post('/user', user_controller);
	app.post('/users', users_controller);
	app.post('/auth', validate({body: AuthReqSchema as JSONSchema7}), AuthenticationController);
	app.post('/register', validate({body: RegReqSchema as JSONSchema7}), register_controller);
	app.post('/messages', messages_controller);
	app.post('/message', message_controller);
	app.use(validation_middleware);


	http_server.listen(PORT, () => {
		console.log(`You-Need server listening on port: ${PORT}`);
	});

})();
