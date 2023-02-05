import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {filter, Observable, Subscription} from "rxjs";
import {Socket} from "ngx-socket-io";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {add_message} from "../../../../../@NGRX/actions/chat";
import {MessageOutputModel} from "../../../../../models/chat/message_output.model";
import {MeetingsListService} from "../../../services/meetings-list/meetings-list.service";
import {MessageInputModel} from "../../../../../models/chat/message_input.model";
import {environment} from "../../../../../../environments/environment";
import {UserModel} from "../../../../../models/chat/user.model";

@Injectable({
	providedIn: 'root'
})
export class ChatService {

	private readonly _messages: MessageOutputModel[] = [];
	private readonly _messages_obs: Observable<MessageOutputModel[]>;

	constructor(
		private store: Store<{messages: MessageOutputModel[]}>,
		private meetings_list_service: MeetingsListService,
		private socket: Socket,
		private http: HttpClient
	) {
		this._messages_obs = store.select('messages');
		this._messages_obs.subscribe(msg_list => {
			console.log(msg_list);
			if(meetings_list_service.selected_meeting?.id === 'temporary') {
				this._messages.splice(0, this._messages.length);
				return;
			}
			this._messages.push(...msg_list.filter(msg => !this._messages.find(({id}) => id === msg.id)));
		});
	}

	public get messages_obs(): Observable<MessageOutputModel[]> {
		return this._messages_obs
	}

	public send_message(text: string, type: 'user' | 'system'): void {

		console.log('user', this.meetings_list_service.receivers);

		if(text == '') return;

		const token = document.cookie
			.split('; ')
			.find((row) => row.startsWith('yn_token='))
			?.split('=')[1];
		const meeting_id = this.meetings_list_service.selected_meeting?.id !== 'temporary' && this.meetings_list_service.selected_meeting?.id || undefined;
		const receivers = this.meetings_list_service.receivers?.length && this.meetings_list_service.receivers || undefined;

		const message: MessageInputModel = {
			type: type,
			meeting_id,
			receivers,
			message: text,
			attachments: ['']
		};
		fetch(environment.server_url + '/message', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Authentication': token || ''
			},
			body: JSON.stringify(message),
		}).then(data => data.json()).then(async (data: MessageOutputModel) => {
			this.store.dispatch(add_message({
				message: data
			}));
			if(receivers) {
				await this.meetings_list_service.request_meetings();
				this.meetings_list_service.select_meeting(this.meetings_list_service.meetings[0].id);
			}
			if(this.meetings_list_service.selected_meeting) this.socket.emit('message', this.meetings_list_service.selected_meeting.id);
			return data;
		}).then(console.log).catch(console.error);
	}

	public member_info(member_id: string): Observable<HttpResponse<UserModel>> {
		const token = document.cookie
			.split('; ')
			.find((row) => row.startsWith('yn_token='))
			?.split('=')[1];
		return this.http.post<UserModel>(environment.server_url + '/user', {id: member_id}, {
			observe: 'response',
			headers: {
				'Content-Type': 'application/json',
				'Authentication': token || ''
			}
		});
	}

	public get messages(): MessageOutputModel[] {
		return this._messages;
	}

}
