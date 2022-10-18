import {MessageModel} from "../chat/message.model";

export interface MeetingModel {
	id: string;
	receiver_id: string;
	receiver_image: string;
	receiver_first_name: string;
	receiver_last_name: string;
	last_message: MessageModel;
	unread_messages_count: number;
}
