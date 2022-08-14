import {Component, Input, OnInit} from '@angular/core';
import {LoggerService} from "../../services/logger/logger.service";
import { faPhone, faPhoneFlip } from '@fortawesome/free-solid-svg-icons';
import {CallWindowService} from "../../services/call-window/call-window.service";

@Component({
	selector: 'app-call-window',
	templateUrl: './call-window.component.html',
	styleUrls: ['./call-window.component.scss']
})
export class CallWindowComponent implements OnInit {

	@Input() type?: 'offer' | 'answer';
	@Input() userId?: string;
	@Input() companionId?: string;

	public icons = {
		faPhone,
		faPhoneFlip
	}

	constructor(
		private Logger: LoggerService,
		private call: CallWindowService
	) {}

	public async acceptCall(): Promise<void> {
		this.Logger.debug('CallWindowComponent', this.userId);
		if(this.userId && this.companionId) {
			this.endCall();
			await this.call.accept({
				initiator: this.userId,
				recipient: this.companionId
			});
		}
	}

	public endCall(): void {
		this.Logger.debug('CallWindowComponent', this.companionId, this.userId);
		if(this.userId && this.companionId) {
			this.call.end({
				initiator: this.userId,
				recipient: this.companionId
			});
			this.call.end({
				initiator: this.companionId,
				recipient: this.userId
			});
		}
	}

	ngOnInit(): void {
	}

}
