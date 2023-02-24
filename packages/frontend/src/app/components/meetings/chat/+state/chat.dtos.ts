export interface MessageRequestDto {
	type: 'user' | 'system';
	meeting_id?: string;
	// receivers?: string[];
	message: string;
	attachments?: string[];
}

export interface MessageResponseDto extends MessageRequestDto {
	id: string;
	sender_id: string;
	full_date: Date;
	date: string;
	time: string;
	is_owner: boolean;
	status: 'sent' | 'received' | 'read';
}
