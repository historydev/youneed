import {ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {
	faCalendar,
	faCheck,
	faCheckDouble,
	faExclamationTriangle,
	faFaceSmile,
	faPaperclip,
	faPaperPlane,
	faVideo,
	IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import {Store} from "@ngrx/store";
import {Socket} from "ngx-socket-io";
import {map, Observable, takeUntil, ReplaySubject, switchMap, Subject} from "rxjs";
import {MemberModel} from "../../+state/meetings.models";
import {CallNotificationService} from "../../../../services/call-notification/call-notification.service";
import {ModalService} from "../../../../services/modal-service/modal.service";
import {MessageOutputModel} from "../../../../models/chat/message_output.model";
import {ButtonModel} from "../../../../models/modal/button.model";
import {AuthenticationService} from "../../../../services/authentication/authentication.service";
import {MeetingsService} from "../../services/meetings/meetings.service";
import {ChatService} from "../services/chat/chat.service";
import {HttpClientService} from "../../../../services/httpClient/http-client.service";
import {selectSelectedMeeting} from "../../+state/selectors";
import {UserModel} from "../../../../models/chat/user.model";

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit, OnDestroy {

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

	$selectedMeeting = this.store.select(selectSelectedMeeting);
	private destroy$: ReplaySubject<void> = new ReplaySubject<void>(1);

	private subject = new Subject<number>();
	private _call_status: 'expert' | 'client' | false = false;

	constructor(
		private meetings_list_service: MeetingsService,
		private chat_service: ChatService,
		private store: Store<{ count: number, messages: MessageOutputModel[] }>,
		private element: ElementRef,
		private call_notification: CallNotificationService,
		public auth: AuthenticationService,
		private modal_service: ModalService,
		private http: HttpClientService,
		private socket: Socket
	) {
		const token = document.cookie
			.split('; ')
			.find((row) => row.startsWith('yn_token='))
			?.split('=')[1];

		socket.on('change_message_status', (msg: MessageOutputModel) => {
			console.log('MESSAGE STATUS', msg);
			const messages_box = this.element.nativeElement.querySelector('.messages');

			if (messages_box) {
				const message = messages_box.querySelector(`#id${msg._id}`);
				message.classList.remove('sent');
				message.classList.remove('received');
				message.classList.add('read');
			}
			// this.store.dispatch(change_message_status({msg}));
		});

		// this.chat_service.messages_obs.subscribe(messages => {
		// 	if (this.meetings_list_service.selected_meeting) {
		// 		const res = this.http.get<any>(environment.server_url + `/call/${this.meetings_list_service.selected_meeting.id}/1/1`);
		// 		res.subscribe(({data}) => {
		// 			console.log(' MEETINGS DATA', data);
		// 			if (data.length > 0) {
		// 				if (data[0].status !== 'finished') {
		// 					this._call_status = data[0].experts.includes(this.auth.user?.id) ? 'expert' : 'client';
		// 				} else {
		// 					this._call_status = false;
		// 				}
		// 			} else {
		// 				this._call_status = false;
		// 			}
		//
		// 		}, console.error);
		//
		// 		setTimeout(() => {
		// 			this.scroll_to();
		// 		}, 80)
		// 	}
		// });
	}

	private create_modal(title: string, text_content: string, buttons: ButtonModel[]): Function {
		return () => this.modal_service.add_modal({
			id: 'chat_modal',
			title,
			text_content,
			buttons
		});
	}

	public complaint() {
		const delay = 550;
		const complaint = this.create_modal(
			'Подать жалобу',
			' ',
			[
				{
					name: 'Отправить',
					style: 'accept',
					onclick: () => {
						setTimeout(() => {
							this.create_modal(
								'Жалоба отправлена',
								`Спасибо, что поделились своим впечатлением с нами. Нам очень жаль, что консультация не соответствовала Вашим ожиданиям.

								Мы не оставим это просто так. Ваши деньги за консультацию не будут отправлены Эксперту, до выяснения обстоятельств.

								На основании Вашей жалобы мы просмотрим видеозапись разговора на соответствие изложенных фактов и проведем независимую экспертизу.

								Если Ваши претензии окажутся обоснованными, то мы вернем Вам деньги в полном объеме.

								О результатах проверки мы сообщим отдельно на электронную почту и на you-need.ru`,
								[
									{
										name: 'Закрыть',
										style: 'cancel',
										onclick() {
											// setTimeout(() => {
											// 	complaint();
											// }, delay);
										}
									},
									// {
									// 	name: 'Продолжить',
									// 	style: 'accept',
									// 	onclick: () => {
									// 		setTimeout(() => {
									// 			rating();
									// 		}, delay);
									// 	}
									// }
								]
							)();
						}, delay);
					}
				}
			]
		)();
	}

	public end_meeting() {

		const delay = 550;

		const rating = this.create_modal(
			'Оценка Эксперта',
			`Пожалуйста, оцените Эксперта.`,
			[
				{
					name: 'Пропустить',
					style: 'default',
					onclick() {

					}
				},
				{
					name: 'Продолжить',
					style: 'accept',
					onclick() {

					}
				}
			]
		);
		const rating_later = this.create_modal(
			'Оценить позже',
			`У Вас будет 12 часов на то, чтобы подать жалобу на Эксперта.`,
			[
				{
					name: 'Назад',
					style: 'cancel',
					onclick: () => {
						setTimeout(() => {
							benefit();
						}, delay);
					}
				},
				{
					name: 'Продолжить',
					style: 'accept',
					onclick() {
						setTimeout(() => {
							rating();
						}, delay);
					}
				}
			]
		);
		const want_complaint = this.create_modal(
			'Хотите пожаловаться на эксперта?',
			'',
			[
				{
					name: 'Да',
					style: 'accept',
					onclick: () => {
						setTimeout(() => {
							complaint();
						}, delay);
					}
				},
				{
					name: 'Нет',
					style: 'cancel',
					onclick: () => {
						setTimeout(() => {
							rating_later();
						}, delay);
					}
				}
			]
		);
		const complaint = this.create_modal(
			'Подать жалобу',
			' ',
			[
				{
					name: 'Назад',
					style: 'cancel',
					onclick() {
						setTimeout(() => {
							want_complaint();
						}, delay);
					}
				},
				{
					name: 'Продолжить',
					style: 'accept',
					onclick: () => {
						setTimeout(() => {
							this.create_modal(
								'Жалоба отправлена',
								`Спасибо, что поделились своим впечатлением с нами. Нам очень жаль, что консультация не соответствовала Вашим ожиданиям.

								Мы не оставим это просто так. Ваши деньги за консультацию не будут отправлены Эксперту, до выяснения обстоятельств.

								На основании Вашей жалобы мы просмотрим видеозапись разговора на соответствие изложенных фактов и проведем независимую экспертизу.

								Если Ваши претензии окажутся обоснованными, то мы вернем Вам деньги в полном объеме.

								О результатах проверки мы сообщим отдельно на электронную почту и на you-need.ru`,
								[
									{
										name: 'Назад',
										style: 'cancel',
										onclick() {
											setTimeout(() => {
												complaint();
											}, delay);
										}
									},
									{
										name: 'Продолжить',
										style: 'accept',
										onclick: () => {
											setTimeout(() => {
												rating();
											}, delay);
										}
									}
								]
							)();
						}, delay);
					}
				}
			]
		);
		const accept_pay = this.create_modal(
			'Подтвердить оплату',
			`При нажатии кнопки «Продолжить» Вы не сможете пожаловаться на Эксперта и вернуть деньги за консультацию.`,
			[
				{
					name: 'Назад',
					style: 'cancel',
					onclick() {
						setTimeout(() => {
							benefit();
						}, delay);
					}
				},
				{
					name: 'Продолжить',
					style: 'accept',
					onclick: () => {
						setTimeout(() => {
							rating();
							const token = document.cookie
								.split('; ')
								.find((row) => row.startsWith('yn_token='))
								?.split('=')[1];

							// const call = this.http.get<any>(`${environment.server_url}/call/${this.meetings_list_service.selected_meeting?.id}/1/1`, {
							// 	observe: 'body',
							// 	headers: {
							// 		'Authentication': token || ''
							// 	}
							// });
							//
							// call.subscribe(({data}) => {
							// 	console.log('END MEETING DATA', data);
							// 	if (data.length > 0) {
							// 		const res = this.http.patch<any>(`${environment.server_url}/call`, {
							// 			id: data[0].id,
							// 			status: 'finished'
							// 		}, {
							// 			observe: 'body',
							// 			headers: {
							// 				'Authentication': token || ''
							// 			}
							// 		});
							//
							// 		res.subscribe(({data}) => {
							// 			console.log('END MEETING RES DATA', data);
							// 		}, console.error);
							// 	}
							// }, console.error);
						}, delay);
					}
				}
			]
		);
		const benefit = this.create_modal(
			'Разговор был полезным?',
			`Оцените, пожалуйста, консультация оказалась полезной для Вас?`,
			[
				{
					name: 'Да',
					style: 'accept',
					onclick: () => {
						setTimeout(() => {
							accept_pay();
						}, delay);
					}
				},
				{
					name: 'Нет',
					style: 'cancel',
					onclick: () => {
						setTimeout(() => {
							want_complaint();
						}, delay);
					}
				},
				{
					name: 'Оценить позже',
					style: 'default',
					onclick() {
						setTimeout(() => {
							rating_later();
						}, delay);
					}
				},
			]
		);

		benefit();
	}

	public get call_status(): 'expert' | 'client' | false {
		return this._call_status;
	}

	public get online(): boolean {
		return this.meetings_list_service._online;
	}

	public get getSelectedMeetingMembersWithoutCurrentUser(): Observable<MemberModel[] | undefined> {
		return this.$selectedMeeting
			.pipe(
				map(meeting => {
					if(meeting) {
						return meeting.members.filter(member => member.id !== this.auth.user?.id);
					}
					console.error('Meeting', meeting);
					return;
				}),
				takeUntil(this.destroy$)
			);
	}

	public addAcceptPayModalWithMemberProfileInformation(member: UserModel): void {
		this.modal_service.add_modal({
			id: 'my_modal1',
			title: 'Подтвердить оплату',
			text_content: `После начала разговора с вашей карты ****0134 будет списано ${member.service_price || 0} рублей за час консультации.`,
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
							title: `Звоним ${member.first_name} ${member.last_name[0]}.`,
							sender_id: this.auth.user?.id || '',
							receiver_id: member.id
						});
					},
					style: 'accept'
				},
			]
		});
	}

	public addCallModalWithMemberProfileInformation(member: UserModel): void {
		this.call_notification.start_call({
			title: `Звоним ${member.first_name} ${member.last_name[0]}.`,
			sender_id: this.auth.user?.id || '',
			receiver_id: member.id
		});
	}

	public getMemberProfileInformation(id: string): Observable<UserModel> {
		return this.http.post<UserModel>('/user', {id});
	}

	public call(): void {
		const sub = this.getSelectedMeetingMembersWithoutCurrentUser
			.pipe(
				switchMap(members => {
					const receiver = members![0];
					return this.getMemberProfileInformation(receiver.id);
				}),
				map(member => {
					if (!this.call_status) {
						this.addAcceptPayModalWithMemberProfileInformation(member);
						return
					}
					this.addCallModalWithMemberProfileInformation(member);
				}),
				takeUntil(this.destroy$)
			).subscribe();
		setTimeout(() => {
			sub.unsubscribe();
		}, 300)
	}

	public on_scroll_messages() {
		return false
	}

	public remove_scroll_textarea() {
		const textarea = this.element.nativeElement.querySelector('.input_box textarea');
		textarea.style.height = '';
		textarea.style.height = `${textarea.scrollHeight - 20}px`;
	}

	private debounce(func: Function, timeout = 300) {
		let timer: any;
		return (...args: any) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				func.apply(this, args);
			}, timeout);
		};
	}

	private check_msg_classname(_class: string): boolean {
		return !_class.includes('owner') && !_class.includes('system') && !_class.includes('read');
	}

	private read_messages() {
		const messages_box = this.element.nativeElement.querySelector('.messages');

		if (messages_box) {
			const line = this.element.nativeElement.querySelector('.read_line');

			const marginBottom = line.getBoundingClientRect().top - messages_box.getBoundingClientRect().bottom;

			const options = {
				root: messages_box,
				rootMargin: `0px 0px ${marginBottom}px 0px`,
				threshold: 0
			}

			const callback = this.debounce((entries: any[], observer: any) => {
				entries.forEach((entry) => {
					const _class = entry.target.className;
					if (entry.isIntersecting && this.check_msg_classname(_class)) {
						this.socket.emit('change_message_status', entry.target.id);
						entry.target.className = entry.target.className.replace('sent', '').replace('received', '') + 'read';
					}
				});
			}, 0);

			return {callback, options};

		}

		return {};
	}

	public scroll_to(val?: number): void {
		const messages_box = this.element.nativeElement.querySelector('.messages');
		if (messages_box) {
			const {callback, options} = this.read_messages();
			const messages = messages_box.querySelectorAll('.message');
			if (callback && options) {
				const observer = new IntersectionObserver(callback, options);
				for (let i = 0; i < messages.length; i++) {
					observer.observe(messages[i]);
				}
			}
			const unread = [...messages].filter((msg: Element) => !msg.className.includes('owner') && !msg.className.includes('read') && !msg.className.includes('system'));
			if (unread.length > 0) {
				messages_box.scrollTo(0, unread[0].offsetTop - messages_box.clientHeight + 50);
			} else {
				messages_box.scrollTo(0, val || messages_box.scrollHeight);
			}
			return;
		}

		console.error('Message box error');
	}

	public send_message(message: string, type: 'user' | 'system'): false {
		this.scroll_to();
		// this.chat_service.send_message(message, type);
		this.element.nativeElement.querySelector('.input_box textarea').value = '';
		this.element.nativeElement.querySelector('.input_box textarea').style.height = '';

		return false
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
			default:
				return this.icons.faCheck;
		}
	}

	ngOnInit(): void {
		this.$selectedMeeting.pipe(map(meeting => {

		}));
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

}
