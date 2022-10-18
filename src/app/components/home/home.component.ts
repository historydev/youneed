import {Component, ElementRef, OnInit} from '@angular/core';
import {GlobalStoreService} from "../../services/global-store/global-store.service";
import {Socket} from "ngx-socket-io";
import {CallNotificationService} from "../../services/call-notification/call-notification.service";
import {LoggerService} from "../../services/logger/logger.service";
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";
import { increment, decrement, reset } from '../../@NGRX/actions/counter';
import {v4 as uuidv4} from "uuid";

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	public userId?: string = this.globalStore.userId;
	public companionId?: string;
	public recipient?: string = '2';
	public title?: string = 'Super title';
	public message?: string = 'Hello';
	count$: Observable<number>;

	constructor(
		private Logger: LoggerService,
		public globalStore: GlobalStoreService,
		private socket: Socket,
		private call: CallNotificationService,
		private store: Store<{count: number}>,
		private elem: ElementRef
	) {
		this.count$ = store.select('count');
	}

	increment() {
		this.store.dispatch(increment());
	}

	decrement() {
		this.store.dispatch(decrement());
	}

	reset() {
		this.store.dispatch(reset());
	}

	public sendNotification(recipient?: string, title?: string, message?: string): void {
		this.socket.emit('pushNotification', {
			id: Math.random(),
			recipient: recipient,
			type: 'global',
			title: title,
			message: message
		});
	}

	public initiateCall(): void {
		this.Logger.debug('HomeComponent initiateCall', this.userId, this.companionId);
		if(this.userId && this.companionId && this.userId !== this.companionId) {
			this.call.start_call({
				sender_id: this.userId,
				receiver_id: this.companionId
			});
		}
	}

	public generate_user_id() {
		this.socket.emit('leaveRoom', this.userId);
		this.userId = uuidv4();
		this.globalStore.userId = this.userId;
		this.socket.emit('joinRoom', this.userId);
	}

	ngOnInit(): void {
		this.generate_user_id();
		const input = this.elem.nativeElement.querySelector('#user_id');
		const handler = function(event: any) {
			event.preventDefault();
			if (event.clipboardData) {
				event.clipboardData.setData("text/plain", input.value);
				console.log(event.clipboardData.getData("text"))
			}
		};
		input.onclick = function() {
			console.log(123)
			input.addEventListener("copy", handler, false);
			document.execCommand("copy");
			input.removeEventListener("copy", handler, false);
		}
	}

}
