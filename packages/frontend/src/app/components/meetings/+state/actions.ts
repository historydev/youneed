import { createAction, props } from '@ngrx/store';
import {MeetingModel} from "./meetings.models";

export const initMeetings = createAction('[ Meetings/Api ] Init Meetings');
export const loadMeetings = createAction('[ Meetings/Api ] Load Meetings');
export const loadSuccess = createAction('[ Meetings/Api ] Load Success', props<{meetings: MeetingModel[]}>());
export const loadFailure = createAction('[ Meetings/Api ] Load Failure');
export const addMeetings = createAction('[ Meetings/Api ] Add Meetings', props<{meetings: MeetingModel[]}>());
export const updateMeeting = createAction('[ Meetings/Api ] Update Meeting', props<{meeting: MeetingModel}>());
export const setSelectedMeeting = createAction(
	'[ Meetings/Api ] Select Meeting',
	props<{ id: string }>()
);
export const DeleteMeetings = createAction('[ Meetings/Api ] Delete Meetings');
