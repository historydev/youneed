export interface MessageInputModel {
	type: 'user' | 'system';
	meeting_id?: string;
	receivers?: string[];
	message: string;
	attachments?: string[];
}
