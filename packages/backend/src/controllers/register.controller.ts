import {NextFunction, Request, Response} from "express";
import {RegisterRequestModel} from "../models/controllers/register/request.model";
import {RegisterInsertModel} from "../models/controllers/register/insert.model";
import {v4 as uuidv4} from "uuid";
import * as argon2 from "argon2";
import {query} from "../databases/mongodb";



export async function register_controller(req: Request<{}, {}, RegisterRequestModel>, res: Response, next: NextFunction) {
	if(req.body) {

		const default_image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Faenza-avatar-default-symbolic.svg/1024px-Faenza-avatar-default-symbolic.svg.png';
		const user: RegisterInsertModel = {
			id: uuidv4(),
			...req.body,
			image: default_image,
			password: await argon2.hash(req.body.password),
			service_price: 2000,
			access: true,
			access_rights: 'user'
		}

		console.log(user)

		query('users').then(async data => {

			const userFound = await data.collection.findOne({email: req.body.email});

			if(!userFound) {
				const response = await data.collection.insertOne(user);
				res.status(200);
				res.send({
					message: 'User register successful'
				});
				res.end();
			} else {
				res.status(200);
				res.send({
					error: 'Email already exist',
					message: 'Denied'
				});
				res.end();
			}

			return data;
		})
			.then(async data => {
				await data.client.close();
			})
			.catch(e => {
				console.error(e.errInfo.details.clausesNotSatisfied[0]);
				res.status(502);
				res.end();
				return new Error('Any error');
			}).finally(() => console.log('Users register finally'));

	}
}
