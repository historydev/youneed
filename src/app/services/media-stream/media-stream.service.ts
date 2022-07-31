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

	private async getUserMedia(video:boolean, audio:boolean): Promise<any> {
		return await navigator.mediaDevices.getUserMedia({video, audio}).then(stream => {
			this.mediaStream = stream;
			return stream;
		});
	}

	public async create(video:boolean, audio:boolean): Promise<any> {
		return this.getUserMedia(video, audio).catch(e => {
			//this.mediaStream = undefined;
			//this.Logger.error('getUserMedia', e);
			return this.getUserMedia(true, false).catch(e => {
				this.mediaStream = undefined;
				//this.Logger.error('getUserMedia 2', e);
				return this.getUserMedia(false, true).catch(e => {
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
