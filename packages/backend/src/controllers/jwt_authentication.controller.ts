import {NextFunction, Request, Response} from "express";
import * as JWT from 'jsonwebtoken';
import {io} from "../main";

function user_undefined(res: Response) {
	res.locals['user'] = undefined;
}

export function jwt_authentication_controller(req: Request, res: Response, next: NextFunction) {

	const header = req.headers['authentication'];
	const JWT_secret = process.env['JWT_SECRET'];

	// console.log(req.method, req.originalUrl, !!header);

	if(JWT_secret) {
		JWT.verify(header?.toString() || '', JWT_secret, (err, data) => {
			if(err) {

				switch (req.method) {
					case 'GET':
						if(req.originalUrl !== '/auth') {
							user_undefined(res);
							res.redirect('/auth');
							res.end();
							return;
						}
						return next();
					case 'POST':
						switch (req.originalUrl) {
							case '/auth':
								next();
								return;
							case '/register':
								next();
								return;
							default:
								user_undefined(res);
								res.sendStatus(401);
								res.end();
								return;
						}
					default:
						user_undefined(res);
						res.sendStatus(401);
						res.end();
				}

			}

			res.locals['user'] = data;
			return next();
		});

		return;
	}

	user_undefined(res);
	res.sendStatus(502);
	res.end();

	return;
}
