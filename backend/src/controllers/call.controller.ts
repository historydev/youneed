import {IRouter, NextFunction, Request, Response} from "express";
import {query} from "../databases/mongodb";
import {QueryModel} from "../models/databases/mongodb/query.model";

export class CallController {

	private _calls?: QueryModel;

	constructor(router: IRouter, route_name: string) {
		this.init().then(_ => {
			this.handle_http_methods(router, route_name);
		});
	}

	private async get(req: Request, res: Response, next: NextFunction): Promise<void> {
		res.sendStatus(200);
	}

	private async post(req: Request, res: Response, next: NextFunction): Promise<void> {
		if(req.body) {
			const call = await this._calls?.collection.findOne({type: req.body.type, members: {$in: req.body.members}});
			if(!call) {
				await this._calls?.collection.insertOne(req.body);
				res.sendStatus(201);
				return;
			}
			res.sendStatus(200);
			res.end();
		}
	}

	private async put(): Promise<void>  {

	}

	private async patch(): Promise<void> {

	}

	private async delete(): Promise<void> {
		return
	}

	private invalid_body(req: Request, res: Response, next: NextFunction): void {
		if(!(req.body instanceof Object)) throw Error('Invalid body');
	}

	private handle_http_methods(router: IRouter, route_name: string) {
		router.route(route_name)
			.all(this.invalid_body.bind(this))
			.get(this.get.bind(this))
			.post(this.post.bind(this))
			.put(this.put.bind(this))
			.patch(this.patch.bind(this))
			.delete(this.delete.bind(this));
	}

	async init(): Promise<void> {
		this._calls = await query('calls');
	}

}


