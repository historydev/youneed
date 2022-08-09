import {Component, Inject, OnInit, SimpleChanges} from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import {MediaRecorderService} from "../../services/media-recorder/media-recorder.service";
import {LoggerService} from "../../services/logger/logger.service";
import {MediaStreamService} from "../../services/media-stream/media-stream.service";
import {P2pService} from "../../services/p2p/p2p.service";
import {Socket} from "ngx-socket-io";
import {
	faPhoneSlash,
	faMicrophone,
	faMicrophoneSlash,
	faVideo,
	faVideoSlash,
	faFileVideo,
	faStop
} from '@fortawesome/free-solid-svg-icons';
import {GlobalStoreService} from "../../services/global-store/global-store.service";

@Component({
	selector: 'app-video-call',
	templateUrl: './video-call.component.html',
	styleUrls: ['./video-call.component.scss'],
	providers: [MediaStreamService, MediaRecorderService, {
		provide: 'userMediaP2p',
		useClass: P2pService
	}]
})
export class VideoCallComponent implements OnInit {

	public userId?: string = this.route.snapshot.paramMap.get('companionId')?.toString() || '';
	public companionId?: string = this.globalStore.userId;
	public localDefaultView?: string;
	public remoteDefaultView?: string;
	private userNoVideoImage: string = 'https://avatarko.ru/img/kartinka/33/multfilm_lyagushka_32117.jpg';
	private companionNoVideoImage: string = 'https://avatarko.ru/img/kartinka/33/multfilm_lyagushka_32117.jpg';
	private mediaStreamConstraints: MediaStreamConstraints = {
		video: {
			width: { min: 1024, ideal: 1280, max: 1920 },
			height: { min: 576, ideal: 720, max: 1080 },
		},
		audio: true
	};
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
		public mediaStream: MediaStreamService,
		public recorder: MediaRecorderService,
		@Inject('userMediaP2p') public p2p: P2pService,
		private Logger: LoggerService,
		private route: ActivatedRoute,
		private socket: Socket,
		private globalStore: GlobalStoreService
	) {
		this.socket.on('mediaStreamInfo', ( video: boolean ) => {
			this.remoteDefaultView = video ? undefined : this.companionNoVideoImage;
		});
		this.p2p.isCallStarted.subscribe(() => {
			this.sendMediaStreamInfo(this.mediaStream.getStream());
		});
	}

	private sendMediaStreamInfo(stream?: MediaStream): void {
		const videoTrack = stream?.getTracks().find(track => track.kind === 'video');
		this.Logger.debug('videoTrack', videoTrack);
		if(videoTrack) {
			this.socket.emit('mediaStreamInfo', {
				id: this.companionId,
				video: videoTrack.enabled
			});
			if(videoTrack.enabled) {
				this.localDefaultView = undefined;
			} else {
				this.localDefaultView = this.userNoVideoImage;
			}

			return;
		}
		this.localDefaultView = this.userNoVideoImage;
		this.socket.emit('mediaStreamInfo', {
			id: this.companionId,
			video: false
		});
	}

	public changeAudio(): void {
		this.mediaStream.changeAudio();
	}

	public async changeVideo(): Promise<void> {
		await this.mediaStream.changeVideo();
		this.sendMediaStreamInfo(this.mediaStream.getStream());
	}

	public ngOnDestroy(): void {
		this.mediaStream.getStream()?.getTracks().forEach(track => track.stop());
	}

	public ngOnInit(): void {
		if(this.userId && this.userId !== this.companionId) {
			this.mediaStream.create(this.mediaStreamConstraints).then(stream => {

				this.Logger.info('STREAM tracks', stream.getTracks());

				this.sendMediaStreamInfo(this.mediaStream.getStream());
				this.recorder.setStream(stream);
				if(this.userId && this.companionId) {
					this.p2p.joinRoom(this.userId, this.companionId);
					this.p2p.setLocalStream(stream);
				}
				return stream
			}).catch(e => this.Logger.error('VideoCall mediastream', e));

			return;
		}

		this.Logger.debug('Video-call', "You can't call your self");
	}

}
