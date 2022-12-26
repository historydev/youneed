import {NextFunction, Request, Response} from "express";
import {query} from "../databases/mongodb";

export async function meetings_controller(req: Request, res: Response, next: NextFunction) {

	const users = await query('users');
	const meetings = await query('meetings');

	const response = await meetings.collection.find({members: { $in: [res.locals['user'].id]}}, {projection:{_id: 0}}).toArray();

	for(let i = 0; i < response.length; i++) {
		for(let m = 0; m < response[i]['members'].length; m++) {
			response[i]['members'][m] = await users.collection.findOne({id: response[i]['members'][m]}, {projection:{_id: 0, password: 0}});
		}

	}

	console.log(response);

	res.send({
		message: response
	});
}
