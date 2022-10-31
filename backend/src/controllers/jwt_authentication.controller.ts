import {NextFunction, Request, Response} from "express";
import * as JWT from 'jsonwebtoken';

export function jwt_authenticationController(req: Request, res: Response, next: NextFunction) {

	const header = req.headers['authentication'];
	const JWT_secret = process.env['JWT_SECRET'];

	if(header) {
		if(JWT_secret) {
			JWT.verify(header.toString(), JWT_secret, (err, data) => {
				if(err) {
					res.sendStatus(401);
					res.end();
					return;
				}

				res.locals['user'] = data;
				return next();
			});

			return;
		}

		res.sendStatus(502);
		res.end();

		return;
	}
	res.sendStatus(401);
	res.end();
}
