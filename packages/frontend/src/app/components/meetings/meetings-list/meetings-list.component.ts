import {ChangeDetectionStrategy, Component, ElementRef, OnInit} from '@angular/core';

import {faCheck, faCheckDouble, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import {Store} from "@ngrx/store";
import {Socket} from "ngx-socket-io";
import {selectAllMeetings} from "../+state/selectors";
import {MeetingModel, MemberModel} from "../+state/meetings.models";
import {MessageOutputModel} from "../../../models/chat/message_output.model";
import {AuthenticationService} from "../../../services/authentication/authentication.service";
import {MeetingsService} from "../services/meetings/meetings.service";
import {HttpClientService} from "../../../services/httpClient/http-client.service";
import {setSelectedMeeting} from "../+state/actions";

@Component({
	selector: 'app-meetings-list',
	templateUrl: './meetings-list.component.html',
	styleUrls: ['./meetings-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetingsListComponent implements OnInit {

	$meetings = this.store.select(selectAllMeetings);

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
		this.meetings_service.setSelectedMeeting(id);
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

	}

	ngOnDestroy() {

	}

}
