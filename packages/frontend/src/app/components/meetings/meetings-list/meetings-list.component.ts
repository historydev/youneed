import {ChangeDetectionStrategy, Component, ElementRef, OnInit} from '@angular/core';

import {faCheck, faCheckDouble, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import {Store} from "@ngrx/store";
import {Socket} from "ngx-socket-io";
import {HttpClient} from "@angular/common/http";
import {set_messages} from "../../../@NGRX/actions/chat";
import {selectAllMeetings, selectSelectedMeetingId} from "../+state/selectors";
import {MeetingModel, MemberModel} from "../+state/meetings.models";
import {MessageOutputModel} from "../../../models/chat/message_output.model";
import {AddMeetings, SetSelectedMeeting} from "../+state/actions";
import {AuthenticationService} from "../../../services/authentication/authentication.service";
import {MeetingsService} from "../services/meetings/meetings.service";
import {environment} from "../../../../environments/environment";

@Component({
	selector: 'app-meetings',
	templateUrl: './meetings-list.component.html',
	styleUrls: ['./meetings-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetingsListComponent implements OnInit {

	$meetings = this.store.select(selectAllMeetings);
	$selectedMeetingId = this.store.select(selectSelectedMeetingId);

	public readonly icons = {
		faCheck,
		faCheckDouble
	}

	constructor(
		private meetings_service: MeetingsService,
		private element: ElementRef,
		private store: Store,
		private socket: Socket,
		private auth: AuthenticationService,
		private http: HttpClient
	) {
		socket.on('message', (meeting_id: string) => {
			this.request_meeting_messages(meeting_id);
			this.meetings_service.request_meetings();
		});
	}

	public member_data(members: MemberModel[]) {
		return members.filter(member => member.id !== this.auth.user?.id)[0];
	}

	public request_meeting_messages(id: string) {
		const token = document.cookie
			.split('; ')
			.find((row) => row.startsWith('yn_token='))
			?.split('=')[1];

		fetch(environment.server_url + '/messages', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Authentication': token || ''
			},
			body: JSON.stringify({
				meeting_id: id
			})
		}).then(data => {
			console.log(data);
			return data
		}).then(data => data.json()).then((data: MessageOutputModel[]) => {
			console.log(data);
			this.store.dispatch(set_messages({
				messages: data
			}));
		}).then(_ => {

			console.log(this.meetings_service.meetings.find(meeting => meeting.id === id));
		}).catch(console.error);
	}

	public select_meeting(id: string): void {
		this.store.dispatch(SetSelectedMeeting({id}));
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

	public get meetings(): MeetingModel[] {
		return this.meetings_service.meetings;
	}

	ngOnInit(): void {

		this.$selectedMeetingId.subscribe(id => {
			if(id) {
				this.request_meeting_messages(id);
				this.meetings_service.select_meeting(id);
			}
		});
	}

	ngOnDestroy() {

	}

}
