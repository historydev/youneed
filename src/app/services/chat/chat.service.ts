import {Injectable} from '@angular/core';
import {MessageModel} from "../../models/chat/message.model";

@Injectable({
	providedIn: 'root'
})
export class ChatService {

	private _messages:MessageModel[] = [];
	private str1:string = 'Hello world!';
	private str2:string = 'How are you? What u mean? What u want?';

	constructor() {

		const date = new Date();
		const hours = date.getHours().toString();
		const minutes = date.getMinutes().toString();
		const valid_hours = `${hours.length > 1 ? hours : '0'+hours}`;
		const valid_minutes = `${minutes.length > 1 ? minutes : '0'+minutes}`;
		const time = valid_hours + ':' + valid_minutes;

		for(let i = 0; i < 10; i++) {
			const sender_id = Math.floor(Math.random() * 3).toString();
			const type = sender_id === '1' ? 'user' : 'system';
			const message = type === 'user' ? Math.floor(Math.random() * 3) > 1 ? this.str1 : this.str2 : 'Вам звонил Евгений Д.';
			this._messages.push({
				id: i.toString(),
				type,
				sender_id,
				receiver_id: '2',
				message,
				date,
				time,
				attachments: Math.floor(Math.random() * 3) > 1 ? ['https://bipbap.ru/wp-content/uploads/2021/07/1551512888_2-730x617.jpg'] : [],
				is_owner: Math.floor(Math.random() * 3) > 1,
				status: Math.floor(Math.random() * 3) > 1 ? 'sent' : Math.floor(Math.random() * 3) > 2 ? 'received' : 'read'
			});
		}
	}

	public get messages(): MessageModel[] {
		return this._messages;
	}

}
