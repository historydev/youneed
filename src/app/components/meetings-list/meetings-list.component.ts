import {Component, ElementRef, OnInit} from '@angular/core';

import {
	faCheck,
	faCheckDouble, IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import {MeetingsListService} from "../../services/meetings-list/meetings-list.service";
import {MeetingModel} from "../../models/meetings-list/meeting.model";
import {set_messages} from "../../@NGRX/actions/chat";
import {Store} from "@ngrx/store";
import {environment} from "../../../environments/environment";
import {MessageOutputModel} from "../../models/chat/message_output.model";
import {Socket} from "ngx-socket-io";
import {request} from "express";
import {MemberModel} from "../../models/meetings-list/member.model";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {HttpClient} from "@angular/common/http";

@Component({
	selector: 'app-meetings-list',
	templateUrl: './meetings-list.component.html',
	styleUrls: ['./meetings-list.component.scss']
})
export class MeetingsListComponent implements OnInit {

	public readonly icons = {
		faCheck,
		faCheckDouble
	}

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
		});
		this.meetings_service.meetings_element = this.element;
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

		this.request_meeting_messages(id);
		this.meetings_service.select_meeting(id);

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
	}

	ngOnDestroy() {

	}

}
