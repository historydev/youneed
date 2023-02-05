export interface MessageRequestDto {
	type: 'user' | 'system';
	meeting_id?: string;
	receivers?: string[];
	message: string;
	attachments?: string[];
}
