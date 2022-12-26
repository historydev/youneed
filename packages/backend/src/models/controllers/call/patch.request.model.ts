export interface CallPatchRequestModel {
	id: string;
	meeting_id?: string;
	type?: 'private' | 'group';
	date?: string;
	time?: string;
	full_date?: Date;
	members?: string[];
	experts?: string[];
	status?: 'active' | 'not_active' | 'finished';
}
