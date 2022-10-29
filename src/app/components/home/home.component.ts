import {Component, OnInit} from '@angular/core';
import {GlobalStoreService} from "../../services/global-store/global-store.service";
import {Socket} from "ngx-socket-io";
import {CallNotificationService} from "../../services/call-notification/call-notification.service";
import {CallListElementModel} from "../../models/call-notification/call-list-element.model";
import {LoggerService} from "../../services/logger/logger.service";
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";
import { increment, decrement, reset } from '../app/app.module';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	public userId?: string = this.globalStore.userId || '1';
	public companionId?: string = '2';
	public recipient?: string = '2';
	public title?: string = 'Super title';
	public message?: string = 'Hello';
	count$: Observable<number>;

	constructor(
		private Logger: LoggerService,
		public globalStore: GlobalStoreService,
		private socket: Socket,
		private call: CallNotificationService,
		private store: Store<{count: number}>
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

	public setUserId(): void {
		this.globalStore.userId = this.userId;
		this.socket.emit('joinRoom', this.userId);
	}

	ngOnInit(): void {

	}

}
