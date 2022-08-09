import {Component, OnInit} from '@angular/core';
import {GlobalStoreService} from "../../services/global-store/global-store.service";
import {PushNotificationService} from "../../services/push-notification/push-notification.service";
import {Socket} from "ngx-socket-io";

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	public userId?: string = '1';
	public companionId?: string = '2';
	public recipient?: string = '2';
	public title?: string = 'Super title';
	public message?: string = 'Hello';

	constructor(
		public globalStore: GlobalStoreService,
		private socket: Socket
	) {}

	public sendNotification(recipient?: string, title?: string, message?: string) {
		this.socket.emit('pushNotification', {
			id: Math.random(),
			recipient: recipient,
			type: 'global',
			title: title,
			message: message
		});
	}

	public setUserId(): void {
		this.globalStore.userId = this.userId;
		this.socket.emit('joinRoom', this.userId);
	}

	ngOnInit(): void {

	}

}
