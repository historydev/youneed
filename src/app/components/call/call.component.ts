
import {Component, Inject, OnInit, Output, SimpleChanges} from '@angular/core';
import {CallService} from "../../services/call/call.service";
import {
	faPhoneSlash,
	faMicrophone,
	faMicrophoneSlash,
	faVideo,
	faVideoSlash,
	faFileVideo,
	faStop,
	faExpand,
	faCompress
} from '@fortawesome/free-solid-svg-icons';
import {MediaStreamElementModel} from "../../models/call/media-stream-element.model";
import {LoggerService} from "../../services/logger/logger.service";
import {GlobalStoreService} from "../../services/global-store/global-store.service";
import {ActivatedRoute} from "@angular/router";
import {CallNotificationService} from "../../services/call-notification/call-notification.service";

@Component({
	selector: 'app-call',
	templateUrl: './call.component.html',
	styleUrls: ['./call.component.scss'],
	providers: []
})
export class CallComponent implements OnInit {

	public icons = {
		faPhoneSlash,
		faMicrophone,
		faVideo,
		faFileVideo,
		faStop,
		faVideoSlash,
		faMicrophoneSlash,
		faExpand,
		faCompress
	};

	private _document = document;
	@Output() public _in_fullscreen: boolean = false;

	constructor(
		public call: CallService,
		private Logger: LoggerService,
		private global_store: GlobalStoreService,
		private route: ActivatedRoute,
		private call_notification: CallNotificationService
	) {
		this.global_store.sidebar_display.emit(false);
		this._document.addEventListener('fullscreenchange', _ => {
			if(!this._document.fullscreenElement) {
				this._in_fullscreen = false;
			}
		});
		this.call.sender_id = this.global_store.userId;
		this.call.receiver_id = this.route.snapshot.paramMap.get('receiver_id')?.toString() || '';
		this.call_notification.in_call = true;
	}

	public get media_streams(): MediaStreamElementModel[] {
		return this.call.media_streams;
	}

	public full_screen() {
		this._in_fullscreen = !this._in_fullscreen;
		if(this._in_fullscreen) {
			this._document.body.requestFullscreen().then();
		} else {
			this._document.exitFullscreen().then();
		}
	}

	public ngOnInit(): void {
		setInterval(() => {
			this.Logger.error('call-component', 'fullscreen', this._in_fullscreen);
		}, 1000)
		this.call.start_outgoing_call();
	}

	public ngOnDestroy(): void {
		this.call_notification.in_call = false;
		//this.call.display_media_p2p.disconnect();
		this.call.user_media_p2p.disconnect();
		this.global_store.sidebar_display.emit(true);
		this.Logger.error('call-component', 'destroyed');
	}

}
