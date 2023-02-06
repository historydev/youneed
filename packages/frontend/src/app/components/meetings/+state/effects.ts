import {inject, Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {MeetingsStateModel} from "./meetings.models";
import { fetch, navigation } from '@nrwl/angular';
import {Actions, concatLatestFrom, createEffect, ofType} from "@ngrx/effects";
import * as fromMeetingsActions from './actions';
import * as fromMeetingsSelectors from './selectors';
import {MeetingsService} from "../services/meetings/meetings.service";
import {map} from "rxjs";
import {addMeetings} from "./actions";

@Injectable()
export class MeetingsEffects {
	actions$ = inject(Actions);

	readonly loadMeetings$ = createEffect(() =>
		this.actions$.pipe(
			ofType(fromMeetingsActions.loadMeetings),
			concatLatestFrom(action => this.store.select(fromMeetingsSelectors.selectMeetingsState)),
			fetch({
				run: (action, state) => {
					return this.meetingsService.getMeetings().pipe(map((feed) => {
						this.store.dispatch(addMeetings({meetings: feed || []}));
						return fromMeetingsActions.loadSuccess({meetings: feed || []});
					}));
				},
				onError: (action, err) => {
					return fromMeetingsActions.loadFailure();
				}
			})
		)
	);

	// readonly loadSuccess$ = createEffect

	constructor(
		private store: Store<MeetingsStateModel>,
		private meetingsService: MeetingsService
	) {}
}
