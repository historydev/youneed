import * as express from 'express';
import * as http from "http";
import socket_io_listener from "./src/socket.io/socket_io";
import {query} from "./src/databases/mongodb";
import { v4 as uuidv4 } from 'uuid';
import * as cors from 'cors';
import {NextFunction, Request, Response} from "express";
import * as argon2 from 'argon2';
import * as fs from "fs";
import {Validator, ValidationError} from "express-json-validator-middleware";
import {RegisterOutputModel} from "./src/models/authorization/register_output.model";
import {RegisterInputModel} from "./src/models/authorization/register_input.model";

const app = express();
const http_server = http.createServer(app);
socket_io_listener(http_server);

function authentication(req: Request, res: Response, next: NextFunction) {
	const authheader = req.headers.authorization;

	if (!authheader) {
		res.setHeader('WWW-Authenticate', 'Basic');
		res.status(401);
		res.end();
		return new Error('You are not authenticated!');
	}

	const auth = Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
	const user = auth[0];
	const pass = auth[1];

	if (user == 'admin' && pass == 'password') {

		// If Authorized user
		return next();
	} else {
		res.setHeader('WWW-Authenticate', 'Basic');
		res.status(401);
		res.end();
		return new Error('You are not authenticated!');
	}

}

const { validate } = new Validator({});
const validation_middleware = (error: any, req: Request, res: Response, next: NextFunction) => {
	// Check the error is a validation error
	if (error instanceof ValidationError) {
		const err_data = error['validationErrors'].body?.[0];

		const message = ((): string => {
			switch (err_data?.keyword) {
				case 'type': return (err_data?.instancePath || 'Object') + ' ' + err_data?.message;
				case 'additionalProperties': return (err_data?.instancePath || 'Object') + ' ' + err_data.message + ': ' + err_data?.params['additionalProperty'];
				default: return (err_data?.instancePath || 'Object') + ' ' + err_data?.message;
			}
		})();

		res.status(400).send({
			error: err_data?.keyword,
			message: 'Validation failed'
			// message: message,
		});
		res.end();
	} else {
		// Pass error on if not a validation error
		next(error);
	}
};

app.use(express.static('../dist/video-call'));
app.use(cors({
	origin: ['http://localhost:4200', 'https://cdpn.io']
}));
app.use(express.json());
//app.use(authorization);

app.get('/', (req, res) => {
	res.sendFile(__dirname, '/index.html');
});

app.post('/test', (req, res) => {
	JSON.parse(req.body.hack);
});

const get_message_with_time = (el: any) => {
	const date = el['date'];
	const hours = date.getHours().toString();
	const minutes = date.getMinutes().toString();
	const valid_hours = `${hours.length > 1 ? hours : '0'+hours}`;
	const valid_minutes = `${minutes.length > 1 ? minutes : '0'+minutes}`;
	const time = valid_hours + ':' + valid_minutes;

	return {
		...el,
		_id: undefined,
		time,
		is_owner: el['sender_id'] === '1'
	}
}

const schema = (file_path: string) => JSON.parse(fs.readFileSync(__dirname + '/src/models' + file_path).toString());

//app.post('/users', validate())

app.post('/auth', validate({body: schema('/authorization/authorization_input.schema.json')}), (req, res) => {
	if(req.body) {
		const user = req.body;

		console.log(user);

		query('users').then(async data => {
			const response = await data.collection.findOne({
				email: user.email
			});

			if(response && await argon2.verify(response['password'], user.password) && user.email === response['email']) {
				res.status(200);
				res.send({
					message: {
						id: response['id'],
						first_name: response['first_name'],
						last_name: response['last_name'],
						email: response['email'],
						image: response['image'],
						service_price: response['service_price']
					}
				})
				res.end();
			} else {
				res.status(401);
				res.send({
					error: 'Unauthorized',
					message: 'Invalid email or password'
				});
				res.end();
			}

			return data;
		})
			.then(async data => {
				await data.client.close();
			})
			.catch(e => {
				console.error(e);
				res.status(502);
				res.end();
				return new Error('Any error');
			}).finally(() => console.log('Users auth finally'));

	}
});

app.post('/register', validate({body: schema('/authorization/register_input.schema.json')}), async (req: Request<{}, {}, RegisterInputModel>, res) => {
	if(req.body) {

		const default_image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Faenza-avatar-default-symbolic.svg/1024px-Faenza-avatar-default-symbolic.svg.png';
		const user: RegisterOutputModel = {
			id: uuidv4(),
			...req.body,
			image: default_image,
			password: await argon2.hash(req.body.password),
			service_price: 2000,
			access: true,
			access_rights: 'user'
		}

		console.log(user)

		query('users').then(async data => {

			const userFound = await data.collection.findOne({email: req.body.email});

			if(!userFound) {
				const response = await data.collection.insertOne(user);
				res.status(200);
				res.send({
					message: response
				});
				res.end();
			} else {
				res.status(200);
				res.send({
					error: 'Email already exist',
					message: 'Denied'
				});
				res.end();
			}

			return data;
		})
			.then(async data => {
				await data.client.close();
			})
			.catch(e => {
				console.error(e.errInfo.details.clausesNotSatisfied[0]);
				res.status(502);
				res.end();
				return new Error('Any error');
			}).finally(() => console.log('Users register finally'));

	}
});

app.post('/messages', (req, res) => {
	console.log(req.body)
	query('messages').then(async data => {
		const response = await data.collection.find({}).toArray();
		console.log(response)
		res.status(200);
		res.send(
			response.map(get_message_with_time)
		);
		res.end();
		return data;
	})
		.then(async data => {
			await data.client.close();
		})
		.catch(e => {
			console.error(e);
			res.status(502);
			res.end();
			return new Error('Any error');
		});
});

app.post('/message', (req, res) => {

	console.log(req.body);

	if(req.body) {
		const {
			meeting_id,
			sender_id,
			message,
			attachments,
			date,
		} = req.body;

		query('meetings').then(data => {

			const id = uuidv4();

			if(!meeting_id) {
				data.collection.insertMany([{
					id: id,
					members: [],
					unread_messages_count: 0
				}]).then(console.log).catch(console.error);
			}

			return {
				id, data
			};
		}).then(response => {
			query('messages').then(async(data) => {
				const message = {
					meeting_id: meeting_id || response.id,
					...req.body,
					date: new Date(),
				};
				await data.collection.insertOne(message);
				res.send(get_message_with_time(message));
			}).then(console.log).catch(_ => console.error('messages', _));

			return response;
		}).catch(_ => console.error('meetings', _));


	}

});

app.use(validation_middleware);

http_server.listen(4000, () => {
	console.log('Server started on port 4000');
});
