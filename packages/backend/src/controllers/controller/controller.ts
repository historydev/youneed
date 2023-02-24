import {IRouter, NextFunction, Request, Response} from "express";
import {ValidatorModel} from "../../models/controllers/controller/validators.model";
import {Collection, MongoClient} from "mongodb";
import {ControllerResponseModel} from "./controller.models";

export class Controller {

	private readonly _router: IRouter;
	private readonly _route: {
		name: string;
		params: string[];
	};
	protected readonly _collection: Collection;
	protected readonly _client: MongoClient;
	protected readonly _mongo_data: { collection: Collection, client: MongoClient }
	private readonly _validator: ValidatorModel;

	constructor(
		router: IRouter,
		route: {
			name: string;
			params: string[];
		},
		mongo_data: {collection: Collection, client: MongoClient},
		validator: ValidatorModel
	) {
		this._router = router;
		this._route = route;
		this._collection = mongo_data.collection;
		this._client = mongo_data.client;
		this._validator = validator;
		this._mongo_data = mongo_data;
		this.init();
	}

	protected async closeClient(): Promise<void> {
		await this._client.close();
	}

	protected async get(req: Request, res: Response<ControllerResponseModel<any, any>>, next: NextFunction): Promise<void> {}

	protected async post(req: Request, res: Response<ControllerResponseModel<any, any>>, next: NextFunction): Promise<void> {}

	protected async put(req: Request, res: Response, next: NextFunction): Promise<void> {}

	protected async patch(req: Request, res: Response, next: NextFunction): Promise<void> {}

	protected async delete(req: Request, res: Response, next: NextFunction): Promise<void> {}

	private validate(req: Request, res: Response<ControllerResponseModel<any, any>>, next: NextFunction): void {
		const method = req.method.toLowerCase();
		const validator = this._validator[method];
		if(!(req.body instanceof Object && Object.keys(req.body).length) && method !== 'get') {
			res.status(200).send({ error: 'Invalid body' }).end();
			return;
		}
		if(validator) return validator(req, res, next);
		next();
	}

	protected init(): void {
		this._router.get(`${this._route.name}${this._route.params.map(param => `/:${param}`).join('')}`, this.get.bind(this));
		this._router.route(this._route.name)
			.all(this.validate.bind(this))
			.post(this.post.bind(this))
			.put(this.put.bind(this))
			.patch(this.patch.bind(this))
			.delete(this.delete.bind(this));
	}

}
