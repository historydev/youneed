import {Component, Inject, OnInit, SimpleChanges} from '@angular/core';

import {CallService} from "../../services/call/call.service";
import {
	faPhoneSlash,
	faMicrophone,
	faMicrophoneSlash,
	faVideo,
	faVideoSlash,
	faFileVideo,
	faStop
} from '@fortawesome/free-solid-svg-icons';
import {MediaStreamElementModel} from "../../models/call/media-stream-element.model";
import {LoggerService} from "../../services/logger/logger.service";

@Component({
	selector: 'app-call',
	templateUrl: './call.component.html',
	styleUrls: ['./call.component.scss'],
	providers: [
		CallService
	]
})
export class CallComponent implements OnInit {

	private readonly _media_streams: MediaStreamElementModel[];

	public icons = {
		faPhoneSlash,
		faMicrophone,
		faVideo,
		faFileVideo,
		faStop,
		faVideoSlash,
		faMicrophoneSlash,
	};

	constructor(
		public call: CallService,
		private Logger: LoggerService
	) {
		this._media_streams = this.call.media_streams;
	}

	public get media_streams(): MediaStreamElementModel[] {
		return this._media_streams;
	}

	public ngOnInit(): void {
		this.call.start_outgoing_call();
	}

	public ngOnDestroy(): void {
		this.Logger.error('call-component', 'destroyed');
		this.call.cancel_outgoing_call();
	}

}
