export interface MessageModel {
	id: string;
	type: 'user' | 'system';
	meeting_id: string;
	sender_id: string;
	message: string;
	date: Date;
	time: string;
	attachments: String[];
	is_owner: boolean;
	status: 'sent' | 'received' | 'read';
}
