import {NextFunction, Request, Response} from "express";
import * as JWT from 'jsonwebtoken';
import {splitAuthorizationHeader} from "./split-authorization-header/split-authorization-header";
import {noAccessRights} from "./no-access-rights/no-access-rights";

export class JsonWebTokenAuthorizationPipe {

	constructor() {}

	private redirect(res: Response, url: string) {
		res.redirect(url);
		res.end();
	}

	private clearUser(res: Response) {
		res.locals['user'] = undefined;
	}

	public checkRequest = (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const authorizationHeader = req.headers.authorization;
		const jsonWebTokenSecret = process.env['JWT_SECRET'];
		const authorization = splitAuthorizationHeader(authorizationHeader).find(({type}) => type.toLowerCase() === 'bearer');

		if(jsonWebTokenSecret) {
			JWT.verify(authorization?.base64key || '', jsonWebTokenSecret, (err, data) => {
				if(err) {
					switch (req.method) {
						case 'GET':
							if(req.originalUrl !== '/auth') {
								this.clearUser(res);
								return this.redirect(res, '/auth');
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
									this.clearUser(res);
									return noAccessRights(res);
							}
						default:
							this.clearUser(res);
							return noAccessRights(res);
					}

				}

				res.locals['user'] = data;
				return next();
			});

			return;
		}

		this.clearUser(res);
		return res.sendStatus(502).end();
	}
}
