import {query} from "../../databases/mongodb";
import {NextFunction, Request, Response} from "express";

export async function users_controller(req: Request, res: Response, next: NextFunction) {
	query('users').then(async data => {
		const response = await data.collection.find({id: { $ne: res.locals['user'].id } }, {projection:{_id: 0, password: 0}}).toArray();
		if(response) {
			res.send({
				message: response
			});
			res.end();
			return;
		}
		res.sendStatus(404);
		res.end();
	});
}
