import {MessageOutputModel} from "../chat/message_output.model";
import {MemberModel} from "./member.model";

export interface MeetingModel {
	id: string;
	type: 'private' | 'group';
	members: MemberModel[];
	last_message?: MessageOutputModel;
	unread_messages_count: number;
}
