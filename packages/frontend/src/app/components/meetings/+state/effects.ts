import {inject, Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {MeetingsStateModel} from "./meetings.models";
import {map} from "rxjs";

@Injectable()
export class MeetingsEffects {
	actions$ = inject(Actions);

	readonly loadMeetings$ = createEffect(() =>
		this.actions$.pipe(
			ofType(fromMeetingsActions.LoadMeetings),
			concatLatestFrom(action => this.store.select(fromMeetings.selectMeetingsState)),
			map(() => fromMeetings.loadMeetingsSucceeded)
		),
	);

	constructor(
		private store: Store<MeetingsStateModel>
	) {}
}
