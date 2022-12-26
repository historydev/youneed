export interface MessageOutputModel {
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
