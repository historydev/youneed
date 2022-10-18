import {Request, Response} from "express";
import * as express from 'express';
import * as http from "http";
import socket_io_listener from "./socket.io/socket_io";
import {query} from "./databases/mongodb";
import { v4 as uuidv4 } from 'uuid';
import * as cors from 'cors';

const app = express();
const http_server = http.createServer(app);
socket_io_listener(http_server);

app.use(express.static('../dist/video-call'));
app.use(cors({
	origin: 'http://localhost:4200'
}));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	res.sendFile(__dirname, '/index.html');
});

app.post('/message', (req, res) => {

	console.log(req.body);

	res.send(req.body);

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
		}).then(res => {
			query('messages').then(async(data) => {
				console.log({
					id: req.body.id,
					meeting_id: meeting_id || res.id,
					...req.body,
				});
				return await data.collection.insertOne({
					meeting_id: meeting_id || res.id,
					...req.body,
				});
			}).then(console.log).catch(_ => console.error('messages', _));

			return res;
		}).then(data => data.data.client.close())/*.catch(_ => console.error('meetings', _));*/


	}

});

http_server.listen(4000, () => {
	console.log('Server started on port 4000');
});
