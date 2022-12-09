import {IRouter, NextFunction, Request, Response} from "express";
import {Controller} from "./controller";
import {ValidatorModel} from "../models/controllers/controller/validators.model";
import {Collection, MongoClient} from "mongodb";
import {ControllerResponseModel} from "../models/controllers/response.model";
import {CallResponseModel} from "../models/controllers/call/response.model";
import {v4 as uuidv4} from "uuid";
import {CallPostRequestModel} from "../models/controllers/call/post.request.model";
import {formatted_date_time} from "./helpers/formatted_date_time";
import {CallPatchRequestModel} from "../models/controllers/call/patch.request.model";
import {CallDeleteRequestModel} from "../models/controllers/call/delete.request.model";

export class CallController extends Controller {

	constructor(router: IRouter, route_name: string, collection: Collection, client: MongoClient, validator: ValidatorModel) {
		super(router, route_name, collection, client, validator);
	}

	override async get(req: Request, res: Response<ControllerResponseModel<CallResponseModel[], any>>, next: NextFunction) {
		const calls:CallResponseModel[] = await this._collection.find({members: {$all: res.locals['user'].id}}, { projection: {_id: 0}}).toArray()
			.then(data => JSON.parse(JSON.stringify(data)));
		try {
			if(calls.length) res.status(200).send({ data: calls })
			else res.status(200).send({ data: null });
			res.end();
		} catch (e) {
			res.status(500).send({ error: e }).end();
		}
	}

	override async post(req: Request<any, CallPostRequestModel>, res: Response<ControllerResponseModel<CallResponseModel, any>>, next: NextFunction) {
		try {
			const {date, time, full_date} = formatted_date_time();
			const expires = new Date(full_date);
			expires.setMilliseconds(12 * 60 * 60 * 1000);
			const members = [res.locals['user'].id, ...req.body.members];

			const data:CallResponseModel = {
				id: uuidv4(),
				type: req.body.members.length > 2 ? 'group' : 'private',
				date,
				time,
				full_date,
				expires,
				members,
				experts: req.body.members,
				status: 'active'
			}
			await this._collection.insertOne(data);
			res.status(200).send({ data }).end();
		} catch (e) {
			res.status(500).send({error: e}).end();
		}
	}

	override async patch(req: Request<any, CallPatchRequestModel>, res: Response<ControllerResponseModel<CallResponseModel, any>>, next: NextFunction) {
		try {
			const members = req.body.members ? [res.locals['user'].id, ...req.body.members] : undefined;
			await this._collection.updateOne(
				{id: req.body.id},
				{
					$set: members ? { ...req.body, type: members.length > 2 ? 'group' : 'private', members } : req.body
				}
			);
			const call = await this._collection.findOne({id: req.body.id});
			res.status(200).send({ data: JSON.parse(JSON.stringify(call)) }).end();
		} catch (e) {
			res.status(500).send({ error: e }).end();
		}
	}

	override async delete(req: Request<any, CallDeleteRequestModel>, res: Response<ControllerResponseModel<CallResponseModel, any>>, next: NextFunction) {
		try {
			const call = await this._collection.findOne({id: req.body.id});
			await this._collection.deleteOne({id: req.body.id});
			res.status(200).send({ data: JSON.parse(JSON.stringify(call)) }).end();
		} catch (e) {
			res.status(500).send({ error: e }).end();
		}
	}

}


