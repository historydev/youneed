import {NextFunction, Request, Response} from "express";

export function basic_authentication_controller(req: Request, res: Response, next: NextFunction) {
	const authheader = req.headers.authorization;

	if (!authheader) {
		res.sendStatus(401);
		res.end();
		return;
	}

	const auth = Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
	const user = auth[0];
	const pass = auth[1];

	if (user == 'admin' && pass == 'password') {

		// If Authorized user
		return next();
	} else {
		res.sendStatus(401);
		res.end();
	}

}
