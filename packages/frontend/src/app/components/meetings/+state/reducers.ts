import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import {AddMeetings, SelectMeeting} from "./actions";
import {MeetingModel, MeetingsStateModel} from "./meetings.models";

export const adapter: EntityAdapter<MeetingModel> =
	createEntityAdapter<MeetingModel>({
		selectId: ({id}) => id,
	});

export const initialState: MeetingsStateModel = adapter.getInitialState({
	selectedMeetingId: '',
	loaded: false,
	loading: false,
});

export const meetingsReducer = createReducer(
	initialState,
	on(SelectMeeting, (state, {id}) => {
		return {...state, selectedMeetingId: id};
	}),
	on(AddMeetings, (state, {meetings}) => {
		return adapter.addMany(meetings, state);
	})
);
