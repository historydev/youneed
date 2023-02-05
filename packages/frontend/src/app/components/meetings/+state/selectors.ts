import { createFeatureSelector, createSelector } from '@ngrx/store';
import {adapter} from "./reducers";
import {MeetingsStateModel} from "./meetings.models";

export const meetingsFeatureKey = '[Meetings/Api] Key';

export const selectFeature =
	createFeatureSelector<MeetingsStateModel>(meetingsFeatureKey);

const selector = <T>(mapping: (state: MeetingsStateModel) => T) =>
	createSelector(selectFeature, mapping);

const { selectAll, selectEntities } = adapter.getSelectors();

export const selectMeetingsEntities = selector((state) => selectEntities(state));
export const selectAllMeetings = selector((state) => selectAll(state));
export const selectSelectedMeetingId = selector((state) => state.selectedMeetingId);

export const selectMeeting = createSelector(
	selectMeetingsEntities,
	selectSelectedMeetingId,
	(entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
