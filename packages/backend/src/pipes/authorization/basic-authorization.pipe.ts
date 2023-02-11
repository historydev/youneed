import {NextFunction, Request, Response} from "express";
import {splitAuthorizationHeader} from "./split-authorization-header/split-authorization-header";
import {noAccessRights} from "./no-access-rights/no-access-rights";

export class BasicAuthorizationPipe {

	constructor() {}

	public checkRequest(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const authorizationHeader = req.headers.authorization;
		const authorization = splitAuthorizationHeader(authorizationHeader).find(({type}) => type.toLowerCase() === 'basic');

		if (!authorizationHeader || !authorization) return noAccessRights(res);

		const keyFromBase64 = Buffer.from(authorization.base64key, 'base64').toString().split(':');
		const user = {
			login: keyFromBase64[0],
			password: keyFromBase64[1]
		};

		if (user.login == 'admin' && user.password == 'admin') return next();

		return noAccessRights(res);
	}

}
