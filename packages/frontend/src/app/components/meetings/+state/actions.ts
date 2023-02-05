import { createAction, props } from '@ngrx/store';
import {MeetingModel} from "./meetings.models";

export const InitMeetings = createAction('[ Meetings/Api ] Init Meetings');
export const LoadMeetings = createAction('[ Meetings/Api ] Load Meetings');
export const LoadSuccess = createAction('[ Meetings/Api ] Load Success', props<{meetings: MeetingModel[]}>());
export const LoadFailure = createAction('[ Meetings/Api ] Load Failure');
export const AddMeetings = createAction('[ Meetings/Api ] Add Meetings', props<{meetings: MeetingModel[]}>());
export const SetSelectedMeeting = createAction(
	'[ Meetings/Api ] Select Meeting',
	props<{ id: string }>()
);
export const DeleteMeetings = createAction('[ Meetings/Api ] Delete Meetings');
