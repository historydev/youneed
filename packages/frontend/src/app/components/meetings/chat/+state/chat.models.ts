import {EntityState} from "@ngrx/entity";

export interface MessageModel {
	_id: string;
	id: string;
	type: 'user' | 'system';
	meeting_id: string;
	sender_id: string;
	date: string;
	time: string;
	full_date: Date;
	message: string;
	attachments: String[];
	is_owner: boolean;
	status: 'sent' | 'received' | 'read';
}

export interface ChatStateModel extends EntityState<MessageModel> {
	loaded: boolean;
	loading: boolean;
}

