import {inject, Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {MeetingsStateModel} from "./meetings.models";
import { fetch, navigation } from '@nrwl/angular';
import {Actions, concatLatestFrom, createEffect, ofType} from "@ngrx/effects";
import * as fromMeetingsActions from './actions';
import * as fromMeetingsSelectors from './selectors';
import {MeetingsService} from "../services/meetings/meetings.service";
import {map} from "rxjs";

@Injectable()
export class MeetingsEffects {
	actions$ = inject(Actions);

	readonly loadMeetings$ = createEffect(() =>
		this.actions$.pipe(
			ofType(fromMeetingsActions.LoadMeetings),
			concatLatestFrom(action => this.store.select(fromMeetingsSelectors.selectMeetingsState)),
			fetch({
				run: (action, state) => {
					return this.meetingsService.request_meetings().pipe(map((feed) => {
						return fromMeetingsActions.LoadSuccess({meetings: feed || []});
					}));
				},
				onError: (action, err) => {

				}
			})
		),
		{dispatch: false}
	);

	constructor(
		private store: Store<MeetingsStateModel>,
		private meetingsService: MeetingsService
	) {}
}
