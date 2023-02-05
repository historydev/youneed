import {ElementRef, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Store} from "@ngrx/store";
import {Socket} from "ngx-socket-io";
import {Observable, map} from "rxjs";
import {AddMeetings, SetSelectedMeeting} from "../../+state/actions";
import {
	MeetingResponseModel
} from "../../../../../../apps/you_need/src/app/models/meetings-list/meeting_response.model";
import {MessageOutputModel} from "../../../../models/chat/message_output.model";
import {MeetingModel} from "../../+state/meetings.models";
import {AuthenticationService} from "../../../../services/authentication/authentication.service";
import {environment} from "../../../../../environments/environment";
import {CallResponseModel} from "you_need_backend/src/models/controllers/call/response.model";
import {selectMeeting} from "../../+state/selectors";

@Injectable({
	providedIn: 'root'
})
export class MeetingsService {

	private _receivers:string[] = [];
	private readonly $selectedMeeting = this.store.select(selectMeeting);
	public _online: boolean = false;
	public _unread_meetings: number = 0;

	constructor(
		private http: HttpClient,
		private store: Store<{messages: MessageOutputModel[]}>,
		private auth: AuthenticationService,
		private socket: Socket
	) {
		this.socket.on('im_online', (user_id: string) => {
			console.log('im_online', user_id);
			this._online = true;
		});

		this.socket.on('new_meeting', (meeting: MeetingModel) => {
			this.request_meetings();
		});

		// this.store.select('messages').subscribe(messages => {
		// 	if(messages.length > 0) {
		// 		const meeting = this._meetings.find(m => m.id === messages[messages.length-1].meeting_id);
		// 		if(meeting) meeting.last_message = messages[messages.length-1];
		// 	}
		// });
	}

	// public find_and_select(member_id: string): void {
	// 	const meeting_id = this._meetings.find(m => m.members.filter(el => {
	// 		if(m.type === 'private') return el.id === this.auth.user?.id || el.id === member_id;
	// 		return;
	// 	}))?.id || '';
	// 	this.select_meeting(meeting_id);
	// }

	public getMeetings() {
		return this.http.post<MeetingResponseModel>(environment.server_url + '/meetings', undefined)
			.pipe(
				map(body => {
					if(body && body.message.length) {
						const data = body.message.map(this.getLastCallFromMeeting);
						this._unread_meetings = 0;
						// Increment unreaded meetings
						data.forEach(meeting => meeting.unread_messages_count > 0 && this.incrementUnreadMeetingsCount());
						return data;
					}
					return [];
				})
			);
	}

	public getLastCallFromMeeting(meeting: MeetingModel) {
		this.http.get<CallResponseModel[]>( environment.server_url + `/call/${meeting.id}/1/1`, ).pipe(map((response) => {
			if(response.length > 0) {
				meeting.last_call_status = response[0].status;
			}
		}));
		if(meeting.last_message?.sender_id === this.auth.user?.id) {
			return {
				...meeting,
				unread_messages_count: 0
			}
		}
		return meeting;
	}

	public incrementUnreadMeetingsCount() {
		this._unread_meetings -= 1;
	}

	public decrementUnreadMeetingsCount() {
		this._unread_meetings += 1;
	}

	public get selected_meeting(): Observable<MeetingModel | undefined> {
		return this.$selectedMeeting;
	}

	public async select_meeting(id: string): Promise<void> {
		if(id !== 'temporary') {
			this._receivers = [];
		}
		this.store.dispatch(SetSelectedMeeting({id}));
		// if(this._selected_meeting) {
		//
		// 	if(this._unread_meetings > 0) this._unread_meetings--;
		//
		// 	if(this._selected_meeting.last_message?.sender_id === this.auth.user?.id) {
		// 		this._selected_meeting.unread_messages_count = 0
		// 	} else {
		// 		const token = document.cookie
		// 			.split('; ')
		// 			.find((row) => row.startsWith('yn_token='))
		// 			?.split('=')[1];
		//
		// 		await this.http.post<any>(environment.server_url + '/meeting', {
		// 			meeting_id: this._selected_meeting.id
		// 		}, {
		// 			observe: 'response',
		// 			headers: {
		// 				'Content-Type': 'application/json',
		// 				'Authentication': token || ''
		// 			}
		// 		}).subscribe(console.log, console.error);
		// 	}
		//
		// 	if(this._selected_meeting.unread_messages_count > 0) {
		// 		this._selected_meeting.unread_messages_count = 0;
		// 	}
		// 	const members = this._selected_meeting.members.filter(m => m.id !== this.auth.user?.id);
		// 	if(members.length > 0) {
		// 		console.log('you_online', this.auth.user?.id, members[0].id)
		// 		this._online = false;
		// 		this.socket.emit('you_online', this.auth.user?.id, members[0].id);
		// 	}
		// }
		//
		// const interval = setInterval(() => {
		// 	if(this._meetings_element) {
		// 		clearInterval(interval);
		// 		this._meetings_element.nativeElement.querySelectorAll('.meeting').forEach((meeting: HTMLElement) => {
		// 			if(meeting.dataset['id'] === this._selected_meeting?.id) {
		// 				meeting.classList.add('meeting_active');
		// 				return;
		// 			}
		// 			meeting.classList.remove('meeting_active');
		// 		});
		// 	}
		// }, 200);
	}

	public set receivers(id_list: string[]) {
		if(id_list) this._receivers?.push(...id_list);
	}

	public get receivers(): string[] {
		return this._receivers;
	}

	// public addMeeting(meeting: MeetingModel): void {
	// 	const m = this._meetings.find(m => m.id === 'temporary');
	// 	console.log('CREATE MEETING', m);
	// 	if(!m) this._meetings.push(meeting);
	// 	else {
	//
	// 		console.log('temporary')
	//
	// 		Object.keys(m).forEach(key => {
	// 			// @ts-ignore
	// 			m[key] = meeting[key];
	// 		});
	// 	}
	// 	console.log(this._meetings);
	//
	// }

	// public remove_meeting(id: string): void {
	// 	const index = this._meetings.findIndex(el => el.id === id);
	// 	this._meetings.splice(index, 1);
	// }

}
