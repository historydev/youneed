import {Injectable} from '@angular/core';
import {LoggerService} from "../logger/logger.service";

@Injectable({
	providedIn: 'root'
})
export class MediaStreamService {

	private mediaStream?: MediaStream;

	constructor(
		private Logger: LoggerService
	) {}

	public getStream(): MediaStream | undefined {
		return this.mediaStream;
	}

	private async getUserMedia(constraints: MediaStreamConstraints): Promise<any> {
		await navigator.mediaDevices.getUserMedia(constraints).then(stream => {
			this.mediaStream = stream;
			return stream;
		}).catch(e => {
			this.Logger.error('mediaStreamService', 'getUserMedia', e);
			this.mediaStream = new MediaStream();
		});
		return this.mediaStream
	}

	public async create(constraints: MediaStreamConstraints): Promise<any> {
		const { video, audio } = constraints;
		return this.getUserMedia(constraints).catch(_ => {
			return this.getUserMedia({video, audio: false}).catch(_ => {
				this.mediaStream = undefined;
				return this.getUserMedia({video: false, audio}).catch(_ => {
					this.mediaStream = new MediaStream();
				});
			});
		});
	}

	public changeAudio(): void {
		this.mediaStream?.getAudioTracks().forEach(track => track.enabled = !track.enabled);
	}

	public changeVideo(): void {
		this.mediaStream?.getVideoTracks().forEach(track => track.enabled = !track.enabled);
	}

}
