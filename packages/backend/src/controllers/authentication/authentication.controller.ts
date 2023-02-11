import {query} from "../../databases/mongodb";
import * as argon2 from "argon2";
import * as JWT from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";
import {UserModel, UserModelFromMongo} from "./authentication.models";

export function authentication_controller(req: Request, res: Response, next: NextFunction) {

	const JWT_secret = process.env['JWT_SECRET'];

	if(req.body && JWT_secret) {
		const userDataFromClient = req.body;

		query('users').then(async data => {
			const userDataFromDatabase = (await data.collection.findOne({
				email: userDataFromClient.email
			})) as UserModelFromMongo;

			if(userDataFromDatabase && await argon2.verify(userDataFromDatabase.password, userDataFromClient.password)) {
				const {
					id,
					firstName,
					lastName,
					email,
					image,
					password,
					servicePrice
				} = userDataFromDatabase;

				const userDataForJWT = {
					id,
					firstName,
					lastName,
					email,
					image,
					servicePrice
				};

				console.log(req.headers)

				JWT.sign(userDataForJWT, JWT_secret, { expiresIn: 60*60 }, (err, token) => {
					console.log(token);
					if(token) {
						JWT.verify(token, JWT_secret, (err, payload: JWT.JwtPayload) => {
							if(err) res.sendStatus(502).end();
							res.status(200).send({ message: {...payload, token} }).end();
						});
						return;
					}

					res.status(502).send({ error: "Server can't proceed request" }).end();

				});

			} else res.status(401).send({ error: 'Unauthorized', message: 'Invalid email or password' }).end();

			return data;
		})
			.then(async data => {
				await data.client.close();
			})
			.catch(e => {
				console.error(e);
				res.status(502).end();
			}).finally(() => console.log('Users auth finally'));

	}
}
