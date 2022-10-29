import {Component, ElementRef, NgZone, OnInit} from '@angular/core';
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
import {fromEvent, Observable} from "rxjs";
import {Store} from "@ngrx/store";
import {MeetingModel} from "../../models/meetings-list/meeting.model";

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
		private chat_service: ChatService,
		private store: Store<{count: number, messages: MessageModel[]}>,
		private element: ElementRef,
		private zone: NgZone
	) {
		this.chat_service.messages.subscribe((value) => {
			if(this.meetings_list_service.selected_meeting) {
				setTimeout(() => {
					this.scroll_to();
				}, 80)
			}
		});
	}

	public on_scroll_messages() {
		return false
	}

	public remove_scroll_textarea() {
		const textarea = this.element.nativeElement.querySelector('.input_box textarea');
		textarea.style.height = '';
		textarea.style.height = `${textarea.scrollHeight-20}px`;
	}

	public scroll_to(val?:number): void {
		const messages_box = this.element.nativeElement.querySelector('.messages');
		messages_box.scrollTo(0, val || messages_box.scrollHeight);
	}

	public send_message(message: string, type: 'user' | 'system'): false {
		this.scroll_to();
		this.chat_service.send_message(message, type);
		this.element.nativeElement.querySelector('.input_box textarea').value = '';
		this.element.nativeElement.querySelector('.input_box textarea').style.height = '';

		return false
	}

	public get messages(): Observable<MessageModel[]> {
		return this.chat_service.messages;
	}

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

	public get selected_meeting(): MeetingModel | undefined {
		return this.meetings_list_service.selected_meeting;
	}

	ngOnInit(): void {
	}

}
