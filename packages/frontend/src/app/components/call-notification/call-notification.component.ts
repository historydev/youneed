import {Component, Input, OnInit} from '@angular/core';
import {LoggerService} from "../../services/logger/logger.service";
import { faPhone, faPhoneFlip } from '@fortawesome/free-solid-svg-icons';
import {CallNotificationService} from "../../services/call-notification/call-notification.service";

@Component({
	selector: 'app-call-notification',
	templateUrl: './call-notification.component.html',
	styleUrls: ['./call-notification.component.scss']
})
export class CallNotificationComponent implements OnInit {

	public icons = {
		faPhone,
		faPhoneFlip
	}

	constructor(
		private Logger: LoggerService,
		public call: CallNotificationService
	) {}

	ngOnInit(): void {
	}

}
