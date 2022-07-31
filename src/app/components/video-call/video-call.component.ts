import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import {MediaRecorderService} from "../../services/media-recorder/media-recorder.service";
import {LoggerService} from "../../services/logger/logger.service";
import {MediaStreamService} from "../../services/media-stream/media-stream.service";
import {SafeUrl} from "@angular/platform-browser";
import {P2pService} from "../../services/p2p/p2p.service";

@Component({
	selector: 'app-video-call',
	templateUrl: './video-call.component.html',
	styleUrls: ['./video-call.component.scss'],
	providers: [MediaStreamService, MediaRecorderService, P2pService]
})
export class VideoCallComponent implements OnInit {

	public userId?: string;
	public companionId?: string;
	public defaultView?: SafeUrl = 'https://st.depositphotos.com/2547675/3009/i/450/depositphotos_30094505-stock-photo-time-clock.jpg';

	constructor(
		public mediaStream: MediaStreamService,
		public recorder: MediaRecorderService,
		public p2p: P2pService,
		private Logger: LoggerService,
		private route: ActivatedRoute,
	) {
		this.companionId = this.route.snapshot.paramMap.get('companionId')?.toString() || '';
		this.userId = this.route.snapshot.paramMap.get('userId')?.toString() || '';
	}

	public changeAudio(): void {
		this.mediaStream.changeAudio();
	}

	public changeVideo(): void {
		this.mediaStream.changeVideo();
	}

	public ngOnDestroy(): void {
		this.mediaStream.getStream()?.getTracks().forEach(track => track.stop());
	}

	public ngOnInit(): void {
		this.mediaStream.create(true, true).then(stream => {
			//if(!stream) this.defaultView = 'https://st.depositphotos.com/2547675/3009/i/450/depositphotos_30094505-stock-photo-time-clock.jpg';
			this.recorder.setStream(stream);
			if(this.userId && this.companionId) {
				this.p2p.joinRoom(this.userId, this.companionId);
				this.p2p.setLocalStream(stream);
			}
			return stream
			//this.Logger.debug('Stream', this.mediaStream.getStream());
			//this.recorder.startRecording();
		}).catch(e => this.Logger.error('VideoCall mediastream', e));
	}

}
