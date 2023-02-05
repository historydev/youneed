import {EntityState} from "@ngrx/entity";
import {MessageOutputModel} from "../../../models/chat/message_output.model";

export interface MemberModel {
	id: string;
	first_name: string;
	last_name: string;
	image: string;
}

export interface MeetingModel {
	id: string;
	type: 'private' | 'group';
	members: MemberModel[];
	last_message?: MessageOutputModel;
	last_call_status?: string;
	unread_messages_count: number;
}

export interface MeetingsStateModel extends EntityState<MeetingModel> {
	selectedMeetingId: string;
	loaded: boolean;
	loading: boolean;
}
