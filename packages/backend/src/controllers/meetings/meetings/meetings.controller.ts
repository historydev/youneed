import {IRouter, NextFunction, Request, Response} from "express";
import {Controller} from "../../controller/controller";
import {Collection, MongoClient} from "mongodb";
import {ValidatorModel} from "../../../models/controllers/controller/validators.model";
import {ControllerResponseModel} from "../../controller/controller.models";
import {MeetingCreateDto, MeetingResponseDto, MeetingResponseFromMongoDto, MeetingUpdateDto} from "./meetings.dtos";
import {v4 as uuidv4} from "uuid";
import {MeetingMemberModel, MeetingModel} from "./meetings.models";
import {CallModel} from "../calls/calls.models";
import {MessageModel} from "../messages/messages.models";

export class MeetingsController extends Controller {
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

	override async get(
		req: Request,
		res: Response<ControllerResponseModel<MeetingResponseDto[], any>>,
		next: NextFunction
	) {
		try {
			const {count, last} = req.params;
			const meetingsFromMongo = (await this._collection
				.find({
					members: {
						$elemMatch: { id: res.locals['user'].id }
					}
				},
				{
					projection: { _id: 0 }
				})
				.sort(last && {$natural: -1})
				.limit(+count)
				.toArray()) as MeetingResponseFromMongoDto[];
			// await this.closeClient();
			res.status(200).send({ message: meetingsFromMongo }).end();
		} catch (error) {
			// await this.closeClient();
			res.status(200).send({ error }).end();
		}
	}

	override async post(
		req: Request<any, any, MeetingCreateDto>,
		res: Response<ControllerResponseModel<MeetingResponseDto, any>>,
		next: NextFunction
	) {
		try {
			const meetingDataForCreate: MeetingCreateDto = req.body;
			const {members} = meetingDataForCreate;
			const {id, firstName, lastName, image}: MeetingMemberModel = res.locals['user'];
			members.push({
				id,
				firstName,
				lastName,
				image,
				expert: false
			});
			const type = members.length > 2 ? 'group' : 'private';
			const meeting: MeetingModel = {
				id: uuidv4(),
				type,
				members,
				calls: [],
				messages: [],
				unreadMessagesCount: 0,
			};
			await this._collection.insertOne(meeting);
			// await this.closeClient();
			res.send({ message: meeting }).end();
		} catch (error) {
			// await this.closeClient();
			res.status(200).send({ error }).end();
		}
	}

	private noIncludesValues<T>(filterTarget: T[], filterExpressionTarget: T[]) {
		return filterTarget.filter(element => !filterExpressionTarget.includes(element));
	}

	override async patch(
		req: Request<any, any, MeetingUpdateDto>,
		res: Response<ControllerResponseModel<MeetingResponseDto, any>>,
		next: NextFunction
	) {
		try {
			const meetingUpdate: MeetingUpdateDto = req.body;
			const {id, members, calls, messages, unreadMessagesCount} = meetingUpdate;
			if(id) {

				if(!members && !calls && !messages && !unreadMessagesCount) throw 'You need at least one property to update';

				const meetingFromMongo = (await this._collection.findOne({id})) as MeetingResponseFromMongoDto;

				if(!meetingFromMongo) throw 'Incorrect meeting id';

				const isLengthOfMembersGreaterThanTwo = [...meetingFromMongo.members, ...members].length > 2;
				const type = isLengthOfMembersGreaterThanTwo ? 'private' : 'group';
				await this._collection.updateOne(
					{id},
					{
						type: type || meetingFromMongo.type,
						unreadMessagesCount: unreadMessagesCount || meetingFromMongo.unreadMessagesCount,
						$push: {
							calls: calls ? {
								$each: this.noIncludesValues<CallModel>(calls, meetingFromMongo.calls),
							} : {},
							members: members ? {
								$each: this.noIncludesValues<MeetingMemberModel>(members, meetingFromMongo.members),
							} : {},
							messages: messages ? {
								$each: this.noIncludesValues<MessageModel>(messages, meetingFromMongo.messages)
							} : {}
						}
					}
				);
				// await this.closeClient();

				return;
			}
			throw 'Meeting id required';
		} catch (error) {
			console.error(error)
			// await this.closeClient();
			res.status(200).send({ error }).end();
		}
	}

}
































