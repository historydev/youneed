import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import {MeetingModel, MeetingsStateModel} from "./meetings.models";
import {addMeetings, setSelectedMeeting} from "./actions";

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
	on(setSelectedMeeting, (state, {id}) => {
		return {...state, selectedMeetingId: id};
	}),
	on(addMeetings, (state, {meetings}) => {
		return adapter.addMany(meetings, state);
	})
);
