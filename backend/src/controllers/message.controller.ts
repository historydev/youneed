import {query} from "../databases/mongodb";
import {v4 as uuidv4} from "uuid";
import {get_message_with_time} from "./helpers/get_message_with_time";
import {NextFunction, Request, Response} from "express";

function get_date_and_time() {
	const months = [
		'Январь',
		'Февраль',
		'Март',
		'Апрель',
		'Май',
		'Июнь',
		'Июль',
		'Август',
		'Сентябрь',
		'Ноябрь',
		'Декабрь',
	];

	const full_date = new Date();
	const day = full_date.getDate();
	const month = full_date.getMonth()-1;
	const hours = full_date.getHours().toString();
	const minutes = full_date.getMinutes().toString();
	const valid_hours = `${hours.length > 1 ? hours : '0'+hours}`;
	const valid_minutes = `${minutes.length > 1 ? minutes : '0'+minutes}`;
	const time = valid_hours + ':' + valid_minutes;

	return {
		date: `${day} ${months[month]}`,
		time,
		full_date,
	}
}

export function message_controller(req: Request, res: Response, next: NextFunction) {

	const user = res.locals['user'];

	const {
		meeting_id,
		type,
		receivers,
		message,
		attachments
	} = req.body;

	console.log(req.body);

	const {
		date,
		time,
		full_date
	} = get_date_and_time();

	query('meetings').then(data => {
		const id = uuidv4();
		if(receivers && receivers.length) {
			data.collection.insertOne({
				id: id,
				type: receivers.length <= 2 ? 'private' : 'group',
				members: [...receivers, user.id],
				last_message: {
					meeting_id: id,
					...req.body,
					sender_id: user.id,
					date,
					time,
					full_date,
					status: 'sent'
				},
				unread_messages_count: 0
			}).then(console.log).catch(console.error);

			return {id, data}

		}
		return { id: meeting_id, data };
	}).then(response => {

		query('messages').then(async(data) => {
			const message = {
				meeting_id: response.id,
				...req.body,
				sender_id: user.id,
				date,
				time,
				full_date,
				status: 'sent'
			};
			await data.collection.insertOne(message);
			await response.data.collection.updateOne({id: response.id}, { $set: { last_message: message }});
			res.send(message);
		}).then(console.log).catch(_ => console.error('messages', _));

		return response;
	}).catch(_ => console.error('meetings', _));

}
