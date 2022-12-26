import {MeetingModel} from "./meeting.model";

export interface MeetingResponseModel {
	error?: any;
	message: MeetingModel[];
}
