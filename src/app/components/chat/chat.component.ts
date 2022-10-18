import {Component, ElementRef, OnInit} from '@angular/core';
import {MeetingsListService} from "../../services/meetings-list/meetings-list.service";
import {
	faExclamationTriangle,
	faVideo,
	faCalendar,
	faCheck,
	faCheckDouble,
	faFaceSmile,
	faPaperPlane,
	faPaperclip, IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import {ChatService} from "../../services/chat/chat.service";
import {MessageModel} from "../../models/chat/message.model";
import {v4 as uuidv4} from "uuid";

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

	public readonly icons = {
		faExclamationTriangle,
		faVideo,
		faCalendar,
		faCheck,
		faCheckDouble,
		faFaceSmile,
		faPaperPlane,
		faPaperclip
	}

	constructor(
		private meetings_list_service: MeetingsListService,
		public chat_service: ChatService,
		private element: ElementRef
	) {}

	public message_icon(message: MessageModel): IconDefinition {
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

	public send_message(): void {
		fetch('http://localhost:4000/message', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: uuidv4(),
				//meeting_id: uuidv4(),
				sender_id: '1',
				message: 'Hello',
				attachments: [''],
				date: new Date(),
				status: 'sent'
			}),
		}).then(console.log).catch(console.error);
	}

	public get selected_meeting() {
		return this.meetings_list_service.selected_meeting;
	}

	ngOnInit(): void {
	}

}
