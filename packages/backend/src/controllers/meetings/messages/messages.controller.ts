import {query} from "../../../databases/mongodb";
import {get_message_with_time} from "../../helpers/get_message_with_time";
import {NextFunction, Request, Response} from "express";

export function messages_controller(req: Request, res: Response, next: NextFunction) {
	if(req.body) {

		const {meeting_id} = req.body;

		if(!meeting_id) {
			console.log('meeting_id not found');
			return;
		}

		query('messages').then(async data => {
			const response = await data.collection.find({meeting_id}).toArray();
			res.status(200);
			res.send(response);
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
	}
}
