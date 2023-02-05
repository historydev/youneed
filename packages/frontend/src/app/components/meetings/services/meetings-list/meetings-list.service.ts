import {ElementRef, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Store} from "@ngrx/store";
import {Socket} from "ngx-socket-io";
import {Observable, map} from "rxjs";
import {AddMeetings} from "../../+state/actions";
import {
	MeetingResponseModel
} from "../../../../../../apps/you_need/src/app/models/meetings-list/meeting_response.model";
import {MessageOutputModel} from "../../../../models/chat/message_output.model";
import {MeetingModel} from "../../+state/meetings.models";
import {AuthenticationService} from "../../../../services/authentication/authentication.service";
import {environment} from "../../../../../environments/environment";

@Injectable({
	providedIn: 'root'
})
export class MeetingsListService {

	private _receivers:string[] = [];
	private _meetings:MeetingModel[] = [];
	private _selected_meeting?: MeetingModel;
	private readonly _obs_selected_meeting: Observable<MeetingModel>;
	private _meetings_element?: ElementRef;
	public _online: boolean = false;
	public _unread_meetings: number = 0;

	constructor(
		private http: HttpClient,
		private store: Store<{messages: MessageOutputModel[]}>,
		private auth: AuthenticationService,
		private socket: Socket
	) {
		let interval: any;
		this._obs_selected_meeting = new Observable<MeetingModel>((sub) => {
			setTimeout(() => {
				if(interval) clearInterval(interval);
			}, 1000);
			interval = setInterval(() => {
				if(this._selected_meeting) sub.next(this._selected_meeting)
			}, 100);
		});
		this.socket.on('im_online', (user_id: string) => {
			console.log('im_online', user_id);
			this._online = true;
		});

		this.socket.on('new_meeting', (meeting: MeetingModel) => {
			this.request_meetings();
		});

		this.store.select('messages').subscribe(messages => {
			if(messages.length > 0) {
				const meeting = this._meetings.find(m => m.id === messages[messages.length-1].meeting_id);
				if(meeting) meeting.last_message = messages[messages.length-1];
			}
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

		return this.http.post<MeetingResponseModel>(environment.server_url + '/meetings', undefined, {
			observe: 'response',
			headers: {
				'Content-Type': 'application/json',
				'Authentication': token || ''
			}
		})
		// .subscribe(res => {
		// 	if(res.body && res.body.message.length) {
		// 		const data = res.body.message.map(el => {
		// 			if(el.last_message?.sender_id === this.auth.user?.id) {
		// 				return {
		// 					...el,
		// 					unread_messages_count: 0
		// 				}
		// 			}
		// 			return el
		// 		});
		//
		// 		this._unread_meetings = 0;
		//
		// 		data.forEach(el => {
		// 			if(el.unread_messages_count > 0) {
		// 				this._unread_meetings++;
		// 			}
		// 		});
		//
		// 		const m = this._selected_meeting?.id;
		//
		// 		// this._meetings = data;
		//
		// 		this._meetings.push(...data.filter(el => !this._meetings.find(({id}) => id === el.id)));
		// 		this.store.dispatch(AddMeetings({
		// 			meetings: data
		// 		}));
		// 		if(m) this.select_meeting(m);
		//
		// 	}
		// }, console.error);
	}

	public set meetings_element(el: ElementRef) {
		this._meetings_element = el;
	}

	public get selected_meeting(): MeetingModel | undefined {
		return this._selected_meeting;
	}

	public get selected_meeting_obs(): Observable<MeetingModel> {
		return this._obs_selected_meeting;
	}

	public async select_meeting(id: string): Promise<void> {
		if(id !== 'temporary') {
			this._receivers = [];
		}
		const meeting = this._meetings.find(meeting => meeting.id === id);
		this._selected_meeting = meeting;
		console.log('SELECTED', this._selected_meeting);
		if(this._selected_meeting) {

			if(this._unread_meetings > 0) this._unread_meetings--;

			if(this._selected_meeting.last_message?.sender_id === this.auth.user?.id) {
				this._selected_meeting.unread_messages_count = 0
			} else {
				const token = document.cookie
					.split('; ')
					.find((row) => row.startsWith('yn_token='))
					?.split('=')[1];

				await this.http.post<any>(environment.server_url + '/meeting', {
					meeting_id: this._selected_meeting.id
				}, {
					observe: 'response',
					headers: {
						'Content-Type': 'application/json',
						'Authentication': token || ''
					}
				}).subscribe(console.log, console.error);
			}

			if(this._selected_meeting.unread_messages_count > 0) {
				this._selected_meeting.unread_messages_count = 0;
			}
			const members = this._selected_meeting.members.filter(m => m.id !== this.auth.user?.id);
			if(members.length > 0) {
				console.log('you_online', this.auth.user?.id, members[0].id)
				this._online = false;
				this.socket.emit('you_online', this.auth.user?.id, members[0].id);
			}
		}

		const interval = setInterval(() => {
			if(this._meetings_element) {
				clearInterval(interval);
				this._meetings_element.nativeElement.querySelectorAll('.meeting').forEach((meeting: HTMLElement) => {
					if(meeting.dataset['id'] === this._selected_meeting?.id) {
						meeting.classList.add('meeting_active');
						return;
					}
					meeting.classList.remove('meeting_active');
				});
			}
		}, 200);
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
		console.log('CREATE MEETING', m);
		if(!m) this._meetings.push(meeting);
		else {

			console.log('temporary')

			Object.keys(m).forEach(key => {
				// @ts-ignore
				m[key] = meeting[key];
			});
		}
		console.log(this._meetings);

	}

	public remove_meeting(id: string): void {
		const index = this._meetings.findIndex(el => el.id === id);
		this._meetings.splice(index, 1);
	}

}
