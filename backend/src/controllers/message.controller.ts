import {query} from "../databases/mongodb";
import {v4 as uuidv4} from "uuid";
import {get_message_with_time} from "./helpers/get_message_with_time";
import {NextFunction, Request, Response} from "express";

export function message_controller(req: Request, res: Response, next: NextFunction) {

	const user = res.locals['user'];

	const {
		meeting_id,
		receiver_id,
		message,
		attachments,
		date
	} = req.body;

	query('meetings').then(data => {
		const id = uuidv4();
		if(receiver_id) {
			data.collection.insertMany([{
				id: id,
				members: [user.id, receiver_id],
				unread_messages_count: 0
			}]).then(console.log).catch(console.error);
		}
		return { id, data };
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
