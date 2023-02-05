import {inject, Injectable} from "@angular/core";
import {Actions, concatLatestFrom, createEffect, ofType} from "@ngrx/effects";
import {map, mergeMap, catchError, Observable} from "rxjs";
import { fetch } from '@nrwl/angular';
import {MeetingsListService} from "../services/meetings-list/meetings-list.service";
import * as fromMeetingsActions from "./actions";
import * as fromMeetings from "./selectors";
import {select, Store} from "@ngrx/store";
import {MeetingsStateModel} from "./meetings.models";
import {selectSelectedMeetingId} from "./selectors";

@Injectable()
export class MeetingsEffects {
	actions$ = inject(Actions);

	// @ts-ignore
	readonly loadMeetings$ = createEffect(() =>
		this.actions$.pipe(
			ofType(fromMeetingsActions.LoadMeetings),
			concatLatestFrom((action) =>
				this.store.select(fromMeetings.selectMeetingsState)
			),
			fetch({
				run: (action, state) => {
					return this.meetingsService.request_meetings().pipe(map(feed => {
						return fromMeetingsActions.AddMeetings({meetings: feed});
					}))
				},
				onError: (action, err) => {

				}
			})
		),
		{ dispatch: false }
	);

	constructor(
		private store: Store<MeetingsStateModel>,
		private readonly meetingsService: MeetingsListService
	) {}
}
