import {ChangeDetectionStrategy, Component, ElementRef, OnInit} from '@angular/core';

import {faCheck, faCheckDouble, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import {MeetingsListService} from "../services/meetings-list/meetings-list.service";
import {MeetingModel} from "../../../models/meetings-list/meeting.model";
import {set_messages} from "../../../@NGRX/actions/chat";
import {Store} from "@ngrx/store";
import {environment} from "../../../../environments/environment";
import {MessageOutputModel} from "../../../models/chat/message_output.model";
import {Socket} from "ngx-socket-io";
import {MemberModel} from "../../../models/meetings-list/member.model";
import {AuthenticationService} from "../../../services/authentication/authentication.service";
import {HttpClient} from "@angular/common/http";
import {selectAllMeetings, selectMeeting, selectSelectedMeetingId} from "../+state/selectors";
import {AddMeetings, SelectMeeting} from "../+state/actions";

@Component({
	selector: 'app-meetings',
	templateUrl: './meetings-list.component.html',
	styleUrls: ['./meetings-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetingsListComponent implements OnInit {

	$meetings = this.store.select(selectAllMeetings);
	$selectedMeetingId = this.store.select(selectSelectedMeetingId);

	constructor(
		private meetings_service: MeetingsListService,
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
		this.meetings_service.meetings_element = this.element;
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

	public get meetings(): MeetingModel[] {
		return this.meetings_service.meetings;
	}

	ngOnInit(): void {

		const token = document.cookie
			.split('; ')
			.find((row) => row.startsWith('yn_token='))
			?.split('=')[1];

		this.meetings_service.request_meetings().then(_ => {
			this.meetings_service.meetings.forEach(meeting => {
				const res = this.http.get<any>( environment.server_url + `/call/${meeting.id}/1/1`, {
					observe: 'body',
					headers: {
						'Authentication': token || ''
					}
				});
				res.subscribe(({data}) => {
					if(data.length > 0) {
						meeting.last_call_status = data[0].status;
					}
				}, console.error);
			});
		});

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
