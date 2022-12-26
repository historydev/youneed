import {Injectable} from '@angular/core';
import {LoggerService} from "../logger/logger.service";

@Injectable({
	providedIn: 'root'
})
export class MediaDevicesService {

	private _user_media?: MediaStream;
	private _user_media_constraints:MediaStreamConstraints;
	private _user_media_audio:boolean = false;
	private _user_media_video:boolean = false;

	private _display_media?: MediaStream;
	private _display_media_constraints:MediaStreamConstraints;
	private _display_media_audio:boolean = false;
	private _display_media_video:boolean = false;

	constructor(
		private Logger: LoggerService
	) {
		this._user_media_constraints = {
			video: false,
			audio: false
		};
		this._display_media_constraints = {
			video: false,
			audio: false
		};
	}

	/*
	********************************
	*
	* Display Media Methods - Start.
	*
	********************************
 	*/

	public get display_media(): MediaStream | undefined {
		return this._display_media;
	}

	public set display_media_constraints(constraints: MediaStreamConstraints) {
		this._display_media_constraints = constraints;
	}

	public get display_media_constraints(): MediaStreamConstraints {
		return this._display_media_constraints;
	}

	public set display_media_video(video: boolean) {
		this._display_media_video = video;
		this._user_media?.getVideoTracks().forEach(track => track.enabled = this._display_media_video);
	}

	public get display_media_video(): boolean {
		return this._display_media_video;
	}

	public set display_media_audio(audio: boolean) {
		this._display_media_audio = audio;
		this._user_media?.getAudioTracks().forEach(track => track.enabled = this._display_media_audio);
	}

	public get display_media_audio(): boolean {
		return this._display_media_audio;
	}

	public async initialize_display_media(): Promise<void> {
		await navigator.mediaDevices.getDisplayMedia(this._display_media_constraints).then(stream => {
			this._display_media = stream;
		}).catch(e => {
			this._display_media = undefined;
			this.Logger.error('MediaDevicesService', 'initialize_display_media', e);
		});

		return;
	}

	/*
	********************************
	*
	* Display Media Methods - End.
	*
	********************************
 	*/

	/*
	*****************************
	*
	* User Media Methods - Start.
	*
	*****************************
 	*/

	public get user_media(): MediaStream | undefined {
		return this._user_media;
	}

	public set user_media_constraints(constraints: MediaStreamConstraints) {
		this._user_media_constraints = constraints;
	}

	public get user_media_constraints(): MediaStreamConstraints {
		return this._user_media_constraints;
	}

	public set user_media_audio(audio: boolean) {
		this._user_media_audio = audio;
		this._user_media?.getAudioTracks().forEach(track => track.enabled = this._user_media_audio);
	}

	public get user_media_audio(): boolean {
		return this._user_media_audio;
	}

	public set user_media_video(video: boolean) {
		this._user_media_video = video;
		this._user_media?.getVideoTracks().forEach(track => track.enabled = this._user_media_video);
	}

	public get user_media_video(): boolean {
		return this._user_media_video;
	}

	public async initialize_user_media(): Promise<void> {
		const { video, audio } = this._user_media_constraints;
		await this.check_user_media_permission(this._user_media_constraints).catch(_ => {
			return this.check_user_media_permission({video, audio: false}).catch(_ => {
				return this.check_user_media_permission({video: false, audio});
			});
		});

		return;
	}

	private async check_user_media_permission(constraints: MediaStreamConstraints): Promise<MediaStream | void> {

		this.Logger.info('media-devices-service', 'constraints', constraints);

		return await navigator.mediaDevices.getUserMedia(constraints).then(stream => {
			this._user_media_constraints = constraints;
			this._user_media = stream;
			this._user_media_video = !!constraints.video;
			this._user_media_audio = !!constraints.audio;
			return stream;
		}).catch(e => {
			this.Logger.error('media-devices-service', e);
			this._user_media_constraints = constraints;
			this._user_media = new MediaStream();
			this._user_media_video = false;
			this._user_media_audio = false;
		});
	}

	/*
	***************************
	*
	* User Media Methods - End.
	*
	***************************
 	*/

}
