import {ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';

import {faCheck, faCheckDouble, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import {Store} from "@ngrx/store";
import {Socket} from "ngx-socket-io";
import {selectAllMeetings, selectSelectedMeetingId} from "../+state/selectors";
import {MeetingModel, MemberModel} from "../+state/meetings.models";
import {MessageOutputModel} from "../../../models/chat/message_output.model";
import {AuthenticationService} from "../../../services/authentication/authentication.service";
import {MeetingsService} from "../services/meetings/meetings.service";
import {HttpClientService} from "../../../services/httpClient/http-client.service";
import {loadMeetings, setSelectedMeeting} from "../+state/actions";
import {map, ReplaySubject, takeUntil} from "rxjs";

@Component({
	selector: 'app-meetings-list',
	templateUrl: './meetings-list.component.html',
	styleUrls: ['./meetings-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetingsListComponent implements OnInit, OnDestroy {

	$meetings = this.store.select(selectAllMeetings);
	$selectedMeetingId = this.store.select(selectSelectedMeetingId);
	private destroy$: ReplaySubject<void> = new ReplaySubject<void>(1);

	public readonly icons = {
		faCheck,
		faCheckDouble
	}

	constructor(
		private meetingsService: MeetingsService,
		private meetingsElement: ElementRef,
		private store: Store,
		private socket: Socket,
		private auth: AuthenticationService,
		private http: HttpClientService
	) {
		socket.on('message', (meeting_id: string) => {
			// this.request_meeting_messages(meeting_id);
			// this.meetings_service.request_meetings();
		});
	}

	public member_data(members: MemberModel[]) {
		return members.filter(member => member.id !== this.auth.user?.id)[0];
	}

	public setSelectedMeeting(id: string): void {
		this.$selectedMeetingId.subscribe(id => {
			if(id) this.removeSelectedClassNameFromMeeting(id);
		}).unsubscribe();
		this.meetingsService.setSelectedMeeting(id);
		this.addSelectedClassNameOnMeeting(id);
	}

	private addSelectedClassNameOnMeeting(id: string) {
		this.meetingsElement.nativeElement.querySelector(`#id${id}`).classList.add('meetingSelected');
	}

	private removeSelectedClassNameFromMeeting(id: string) {
		this.meetingsElement.nativeElement.querySelector(`#id${id}`).classList.remove('meetingSelected');
	}

	public message_icon(message: MessageOutputModel): IconDefinition {
		switch (message.status) {
			case 'sent': {
				return this.icons.faCheck;
			}
			case 'received': {
				return this.icons.faCheck;
			}
			case 'read': {
				return this.icons.faCheckDouble;
			}
			default: return this.icons.faCheck;
		}
	}

	ngOnInit(): void {
		this.store.dispatch(loadMeetings());
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

}
