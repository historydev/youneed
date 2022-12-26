import {NextFunction, Request, Response} from "express";
import {query} from "../databases/mongodb";

export async function user_controller(req: Request, res: Response, next: NextFunction) {

	if(req.body) {

		const users = await query('users');
		const user = await users.collection.findOne({id: req.body.id});

		if(user) {
			res.send(user);
			res.end();
			return;
		}
	}

	res.send(res.locals['user']);
	res.end();
}
