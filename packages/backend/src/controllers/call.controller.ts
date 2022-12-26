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
import {CallGetRequestModel} from "../models/controllers/call/get.request.model";
import {query} from "../databases/mongodb";

export class CallController extends Controller {

	constructor(
		router: IRouter,
		route: {
			name: string;
			params: string[];
		},
		mongo_data: { collection: Collection, client: MongoClient },
		validator: ValidatorModel
	) {
		super(router, route, mongo_data, validator);
	}

	override async get(req: Request<any, CallGetRequestModel>, res: Response<ControllerResponseModel<CallResponseModel[], any>>, next: NextFunction) {

		if(!req.params.meeting_id || !+req.params.meeting_id) {
			try {
				const calls:CallResponseModel[] = await this._collection
					.find({}, { projection: {_id: 0}})
					.sort({_id: +req.params.last ? -1 : 1})
					.limit(+req.params.limit || 50)
					.toArray()
					.then(data => JSON.parse(JSON.stringify(data)));
				if(+req.params.last) {
					calls.reverse();
				}
				if(calls.length) res.status(200).send({ data: calls });
				else res.status(200).send({ data: null });
				res.end();
			} catch (error) {
				res.status(500).send({ error }).end();
			}
			return;
		}

		try {
			const calls:CallResponseModel[] = await this._collection
				.find({meeting_id: req.params.meeting_id}, { projection: {_id: 0}})
				.sort({_id: +req.params.last ? -1 : 1})
				.limit(+req.params.limit || 50)
				.toArray()
				.then(data => JSON.parse(JSON.stringify(data)));
			if(+req.params.last) {
				calls.reverse();
			}
			if(calls.length) res.status(200).send({ data: calls });
			else res.status(200).send({ data: null });
			res.end();
		} catch (error) {
			res.status(500).send({ error }).end();
		}
	}



	override async post(req: Request<any, CallPostRequestModel>, res: Response<ControllerResponseModel<CallResponseModel, any>>, next: NextFunction) {
		try {
			const {date, time, full_date} = formatted_date_time();
			const expires = new Date(full_date);
			expires.setMilliseconds(12 * 60 * 60 * 1000);

			const meeting_id = req.body.meeting_id;
			const _query = await query('meetings');
			const m_coll = await _query.collection;
			const meeting = await m_coll.findOne({id: meeting_id}, {projection: { _id: 0 }});

			if(meeting) {
				const members = meeting['members'];
				const type = meeting['type'];
				const experts = members.filter((member: any) => member !== res.locals['user'].id);

				console.log(res.locals['user'].id);

				const data:CallResponseModel = {
					id: uuidv4(),
					meeting_id,
					type,
					date,
					time,
					full_date,
					expires,
					members,
					experts,
					status: 'active'
				}
				await this._collection.insertOne(data);
				res.status(200).send({ data }).end();

				return;
			}

			throw new Error();

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


