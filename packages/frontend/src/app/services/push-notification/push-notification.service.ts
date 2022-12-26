import {Injectable} from '@angular/core';
import {LoggerService} from "../logger/logger.service";
import {NotificationModel} from "../../models/push-notification/notification.model";

@Injectable({
	providedIn: 'root'
})
export class PushNotificationService {

	public readonly list: NotificationModel[] = [];

	constructor(
		private Logger: LoggerService
	) {
		setInterval(() => {
			if(this.list.length > 0) {
				this.list.shift();
				console.log(this.list);
			}
		}, 15000);
	}

	public add(data: NotificationModel): void {
		this.list.push({
			id: Math.random(),
			...data
		});
		if(this.list.length > 5) this.list.shift();
	}

	public remove(id?: number): void {
		const index = this.list.findIndex(item => item.id === id);
		this.list.splice(index, 1);
	}

}
