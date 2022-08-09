import {Component, OnInit} from '@angular/core';
import {LoggerService} from "../../services/logger/logger.service";
import {PushNotificationService} from "../../services/push-notification/push-notification.service";
import {NotificationModel} from "../../models/push-notification/notification.model";

@Component({
	selector: 'app-push-notification',
	templateUrl: './push-notification.component.html',
	styleUrls: ['./push-notification.component.scss']
})
export class PushNotificationComponent implements OnInit {

	constructor(
		private Logger: LoggerService,
		public notifications: PushNotificationService
	) {}

	ngOnInit(): void {
	}

}
