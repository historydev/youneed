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
	faCompress,
	faComment
} from '@fortawesome/free-solid-svg-icons';
import {MediaStreamElementModel} from "../../models/call/media-stream-element.model";
import {LoggerService} from "../../services/logger/logger.service";
import {ActivatedRoute} from "@angular/router";
import {CallNotificationService} from "../../services/call-notification/call-notification.service";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {Socket} from "ngx-socket-io";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ChatService} from "../meetings/chat/services/chat/chat.service";
import {MeetingsService} from "../meetings/services/meetings/meetings.service";

@Component({
	selector: 'app-call',
	templateUrl: './call.component.html',
	styleUrls: ['./call.component.scss']
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
		faCompress,
		faComment
	};

	public _chat_state: boolean = false;

	private _document = document;
	@Output() public _in_fullscreen: boolean = false;

	constructor(
		public call: CallService,
		private Logger: LoggerService,
		private route: ActivatedRoute,
		private call_notification: CallNotificationService,
		private auth: AuthenticationService,
		private chat_service: ChatService,
		private meeting_service: MeetingsService,
		private socket: Socket,
		private http: HttpClient,
	) {
		this._document.addEventListener('fullscreenchange', _ => {
			if(!this._document.fullscreenElement) {
				this._in_fullscreen = false;
			}
		});
		this.call.sender_id = this.auth.user?.id;
		this.call.receiver_id = this.route.snapshot.paramMap.get('receiver_id')?.toString() || '';
		meeting_service.find_and_select(this.call.receiver_id);
		this.call_notification.in_call = true;
	}

	public chat_state(): void {
		this._chat_state = !this._chat_state;
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
		this.Logger.error('call-component', 'CALL INIT');
		this.call.start_outgoing_call();
	}

	public send_end_call_message(): void {
		this.chat_service.send_message('Звонок завершён', 'system');
	}

	public ngOnDestroy(): void {
		this.call_notification.in_call = false;
		//this.call.display_media_p2p.disconnect();
		const token = document.cookie
			.split('; ')
			.find((row) => row.startsWith('yn_token='))
			?.split('=')[1];

		const call = this.http.get<any>(`${environment.server_url}/call/${this.meeting_service.selected_meeting?.id}/1/1`, {
			observe: 'body',
			headers: {
				'Authentication': token || ''
			}
		});

		call.subscribe(({data}) => {
			console.log('CALL DATA', data);
			if(data.length > 0) {
				const res = this.http.patch<any>(`${environment.server_url}/call`, {
					id: data[0].id,
					status: 'not_active'
				}, {
					observe: 'body',
					headers: {
						'Authentication': token || ''
					}
				});

				res.subscribe(({data}) => {
					console.log('RES DATA', data);
				}, console.error);
			}
		}, console.error);

		this.call_notification.decline_call(`${this.call.receiver_id}-${this.call.sender_id}`);
		this.call.user_media_p2p.disconnect();
		this.socket.emit('stop_timer');
		this.Logger.error('call-component', 'destroyed');
	}

}
