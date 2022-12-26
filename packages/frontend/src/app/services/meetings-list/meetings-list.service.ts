import {ElementRef, Injectable} from '@angular/core';
import {MeetingModel} from "../../models/meetings-list/meeting.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {MeetingResponseModel} from "../../models/meetings-list/meeting_response.model";
import {Element} from "@angular/compiler";
import {Store} from "@ngrx/store";
import {MessageOutputModel} from "../../models/chat/message_output.model";
import {Socket} from "ngx-socket-io";
import {AuthenticationService} from "../authentication/authentication.service";

@Injectable({
	providedIn: 'root'
})
export class MeetingsListService {

	private _receivers:string[] = [];
	private _meetings:MeetingModel[] = [];
	private _selected_meeting?: MeetingModel;
	private _meetings_element?: ElementRef;

	constructor(
		private http: HttpClient,
		private store: Store<{messages: MessageOutputModel[]}>,
		private auth: AuthenticationService
	) {
		this.store.select('messages').subscribe(messages => {
			const meeting = this._meetings.find(m => m.id === messages[messages.length-1].meeting_id);
			if(meeting) meeting.last_message = messages[messages.length-1];
		});
	}

	public find_and_select(member_id: string): void {
		const meeting_id = this._meetings.find(m => m.members.filter(el => {
			if(m.type === 'private') return el.id === this.auth.user?.id || el.id === member_id;
			return;
		}))?.id || '';
		this.select_meeting(meeting_id);
	}

	public async request_meetings() {
		const token = document.cookie
			.split('; ')
			.find((row) => row.startsWith('yn_token='))
			?.split('=')[1];

		await this.http.post<MeetingResponseModel>(environment.server_url + '/meetings', undefined, {
			observe: 'response',
			headers: {
				'Content-Type': 'application/json',
				'Authentication': token || ''
			}
		}).subscribe(res => {
			if(res.body && res.body.message.length) {
				this._meetings = res.body.message;
			}
		}, console.error);

		await new Promise(r => setTimeout(r, 200));
	}

	public set meetings_element(el: ElementRef) {
		this._meetings_element = el;
	}

	public get selected_meeting(): MeetingModel | undefined {
		return this._selected_meeting;
	}

	public select_meeting(id: string): void {
		if(id !== 'temporary') {
			this._receivers = [];
		}
		this._selected_meeting = this._meetings.find(meeting => meeting.id === id);
		if(this._selected_meeting && this._selected_meeting.unread_messages_count > 0) this._selected_meeting.unread_messages_count = 0;
		this._meetings_element?.nativeElement.querySelectorAll('.meeting').forEach((meeting: HTMLElement) => {
			if(meeting.dataset['id'] === this._selected_meeting?.id) {
				meeting.classList.add('meeting_active');
				return;
			}
			meeting.classList.remove('meeting_active');
		});
	}

	public set receivers(id_list: string[]) {
		if(id_list) this._receivers?.push(...id_list);
	}

	public get receivers(): string[] {
		return this._receivers;
	}

	public get meetings(): MeetingModel[] {
		return this._meetings;
	}

	public create_meeting(meeting: MeetingModel): void {
		const m = this._meetings.find(m => m.id === 'temporary');
		if(!m) this._meetings.push(meeting);
		else {
			Object.keys(m).forEach(key => {
				// @ts-ignore
				m[key] = meeting[key];
			});
		}
		setTimeout(() => {
			this.select_meeting(meeting.id);
		});
	}

	public remove_meeting(id: string): void {
		const index = this._meetings.findIndex(el => el.id === id);
		this._meetings.splice(index, 1);
	}

}
