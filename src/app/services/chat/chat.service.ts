import {Injectable} from '@angular/core';
import {MessageModel} from "../../models/chat/message.model";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {v4 as uuidv4} from "uuid";
import {Socket} from "ngx-socket-io";
import {MeetingsListService} from "../meetings-list/meetings-list.service";
import {add_message, get_messages} from "../../@NGRX/actions/chat";

@Injectable({
	providedIn: 'root'
})
export class ChatService {

	private readonly _messages: Observable<MessageModel[]>;
	private readonly _meeting_id?: string;

	constructor(
		private store: Store<{messages: MessageModel[]}>,
		private meetings_list_service: MeetingsListService,
	) {
		this._meeting_id = meetings_list_service.selected_meeting?.id;
		this._messages = store.select('messages');
	}

	public send_message(text: string, type: 'user' | 'system'): void {
		const message: MessageModel = {
			id: uuidv4(),
			type: type,
			meeting_id: this._meeting_id || '',
			sender_id: '2',
			message: text,
			attachments: [''],
			time: '',
			date: new Date(),
			is_owner: false,
			status: 'sent'
		};
		fetch('http://localhost:4000/message', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(message),
		}).then(data => data.json()).then((data: MessageModel) => {
			this.store.dispatch(add_message({
				message: data
			}));
			return data
		}).then(console.log).catch(console.error);
	}

	public get messages(): Observable<MessageModel[]> {
		return this._messages;
	}

}
