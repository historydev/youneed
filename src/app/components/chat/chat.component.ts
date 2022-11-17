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
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";
import {MeetingModel} from "../../models/meetings-list/meeting.model";
import {MessageOutputModel} from "../../models/chat/message_output.model";
import {CallNotificationService} from "../../services/call-notification/call-notification.service";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {MemberModel} from "../../models/meetings-list/member.model";
import {ModalService} from "../../services/modal-service/modal.service";
import {UserModel} from "../../models/chat/user.model";

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
		private store: Store<{count: number, messages: MessageOutputModel[]}>,
		private element: ElementRef,
		private call_notification: CallNotificationService,
		private auth: AuthenticationService,
		private modal_service: ModalService
	) {
		this.chat_service.messages.subscribe(() => {
			if(this.meetings_list_service.selected_meeting) {
				setTimeout(() => {
					this.scroll_to();
				}, 80)
			}
		});
	}

	public member_data(members: MemberModel[]) {
		return members.filter(member => member.id !== this.auth.user?.id)[0];
	}

	public call(receiver_id: string) {
		this.chat_service.member_info(receiver_id).subscribe(data => {
			this.modal_service.add_modal({
				id: 'my_modal1',
				title: 'Подтвердите действие',
				text_content: `После начала разговора с вашей карты ****0134 будет списано ${data.body?.service_price || 0} рублей за час консультации.`,
				buttons: [
					{
						name: 'Отмена',
						onclick: () => {
							//alert();
						},
						style: 'cancel'
					},
					{
						name: 'Начать разговор',
						onclick: () => {
							this.call_notification.start_call({
								title: `Звоним ${data.body?.first_name} ${data.body?.last_name[0]}.`,
								sender_id: this.auth.user?.id || '',
								receiver_id: receiver_id
							});
						},
						style: 'accept'
					},
				]
			});
		}, console.error);

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
		if(messages_box) {
			messages_box.scrollTo(0, val || messages_box.scrollHeight);
			return;
		}
		console.error('Message box error');
	}

	public send_message(message: string, type: 'user' | 'system'): false {
		this.scroll_to();
		this.chat_service.send_message(message, type);
		this.element.nativeElement.querySelector('.input_box textarea').value = '';
		this.element.nativeElement.querySelector('.input_box textarea').style.height = '';

		return false
	}

	public get messages(): Observable<MessageOutputModel[]> {
		return this.chat_service.messages;
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

	public get selected_meeting(): MeetingModel | undefined {
		return this.meetings_list_service.selected_meeting;
	}

	ngOnInit(): void {
	}

}
