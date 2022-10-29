import {Injectable} from '@angular/core';
import {MeetingModel} from "../../models/meetings-list/meeting.model";

@Injectable({
	providedIn: 'root'
})
export class MeetingsListService {

	private _user_id?:string;
	private _meetings:MeetingModel[] = [];
	private _selected_meeting?: MeetingModel;

	constructor(

	) {
		for(let i = 0; i < 25; i++) {

			const date = new Date();
			const hours = date.getHours().toString();
			const minutes = date.getMinutes().toString();
			const valid_hours = `${hours.length > 1 ? hours : '0'+hours}`;
			const valid_minutes = `${minutes.length > 1 ? minutes : '0'+minutes}`;
			const time = valid_hours + ':' + valid_minutes;

			console.log(time)

			this._meetings.push({
				id: i.toString(),
				receiver_id: i.toString(),
				receiver_image: 'https://variety.com/wp-content/uploads/2022/02/Screen-Shot-2022-05-09-at-10.04.13-AM.png?w=681&h=383&crop=1&resize=681%2C383',
				receiver_first_name: 'Владимир',
				receiver_last_name: 'Разработчик',
				last_message: {
					id: i.toString(),
					type: 'user',
					meeting_id: '327d52c2-f2c9-42ab-b5aa-72942068a7d1',
					sender_id: '1',
					message: 'Hello world',
					date: new Date(),
					time: time,
					attachments: Math.floor(Math.random() * 3) > 1 ? ['https://bipbap.ru/wp-content/uploads/2021/07/1551512888_2-730x617.jpg'] : [],
					is_owner: true,
					status: Math.floor(Math.random() * 3) > 1 ? 'sent' : Math.floor(Math.random() * 3) > 2 ? 'received' : 'read'
				},
				unread_messages_count: Math.floor(Math.random() * 10),
			});
		}
	}

	public get selected_meeting(): MeetingModel | undefined {
		return this._selected_meeting;
	}

	public select_meeting(id: string): void {
		this._selected_meeting = this._meetings.find(meeting => meeting.id === id);
	}

	public set user_id(id: string | undefined) {
		this._user_id = id;
	}

	public get user_id(): string | undefined {
		return this._user_id;
	}

	public get meetings(): MeetingModel[] {
		return this._meetings;
	}

	public create_meeting(meeting: MeetingModel): void {}

	public remove_meeting(id: string): void {}

	private find_user_meetings(): void {}

}
