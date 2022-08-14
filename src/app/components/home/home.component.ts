import {Component, OnInit} from '@angular/core';
import {GlobalStoreService} from "../../services/global-store/global-store.service";
import {Socket} from "ngx-socket-io";
import {CallWindowService} from "../../services/call-window/call-window.service";
import {CallModel} from "../../models/call-window/call.model";
import {LoggerService} from "../../services/logger/logger.service";

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

	constructor(
		private Logger: LoggerService,
		public globalStore: GlobalStoreService,
		private socket: Socket,
		private call: CallWindowService
	) {}

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
			this.call.initiate({
				initiator: this.userId,
				recipient: this.companionId
			});
		}
	}

	public getCalls(): CallModel[] {
		this.Logger.debug('HomeComponent getCalls', this.call.calls);
		return this.call.calls;
	}

	public currentCall(): CallModel[] {
		this.Logger.debug('HomeComponent currentCall', this.call.currentCall);
		return this.call.currentCall;
	}

	public setUserId(): void {
		this.globalStore.userId = this.userId;
		this.socket.emit('joinRoom', this.userId);
	}

	ngOnInit(): void {

	}

}
