export interface MessageModel {
	id: string;
	type: 'user' | 'system';
	sender_id: string;
	receiver_id: string;
	message: string;
	date: Date;
	time: string;
	attachments: String[];
	is_owner: boolean;
	status: 'sent' | 'received' | 'read';
}
