import {query} from "../databases/mongodb";
import * as argon2 from "argon2";
import * as JWT from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";

export function authentication_controller(req: Request, res: Response, next: NextFunction) {

	const JWT_secret = process.env['JWT_SECRET'];

	if(req.body && JWT_secret) {
		const user = req.body;

		query('users').then(async data => {
			const response = await data.collection.findOne({
				email: user.email
			});

			if(response && await argon2.verify(response['password'], user.password) && user.email === response['email']) {
				const user = {
					id: response['id'],
					first_name: response['first_name'],
					last_name: response['last_name'],
					email: response['email'],
					image: response['image'],
					service_price: response['service_price']
				};

				JWT.sign(user, JWT_secret, { expiresIn: 60*60 }, (err, token) => {
					console.log(token);
					if(token) {

						JWT.verify(token, JWT_secret, (err, data) => {
							res.setHeader('Authentication', token);
							res.status(200);
							res.send({
								message: data
							});
							res.end();
						});

						return;
					}

					res.status(502);
					res.send({
						message: "Server can't proceed request"
					});
					res.end();

				});

			} else {
				res.status(401);
				res.send({
					error: 'Unauthorized',
					message: 'Invalid email or password'
				});
				res.end();
			}

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
			}).finally(() => console.log('Users auth finally'));

	}
}
