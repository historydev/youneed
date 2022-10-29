import {Inject, Injectable} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {MediaRecorderService} from "../media-recorder/media-recorder.service";
import {LoggerService} from "../logger/logger.service";
import {MediaDevicesService} from "../media-devices/media-devices.service";
import {P2pConnectorService} from "../p2p/p2p-connector.service";
import {Socket} from "ngx-socket-io";
import {MediaStreamElementModel} from "../../models/call/media-stream-element.model";

@Injectable({
	providedIn: 'root'
})
export class CallService {

	private _sender_id?: string;
	private _receiver_id?: string;
	private _local_image_no_camera?: string;
	private _remote_image_no_camera?: string;
	private _user_media_constraints: MediaStreamConstraints;
	private readonly _media_streams: MediaStreamElementModel[] = [];
	private _assets: any;


	constructor(
		public media_devices: MediaDevicesService,
		public recorder: MediaRecorderService,
		@Inject('user_media') public user_media_p2p: P2pConnectorService,
		//@Inject('display_media') public display_media_p2p: P2pConnectorService, TODO Add screen sharing with SFU
		private Logger: LoggerService,
		private route: ActivatedRoute,
		private socket: Socket
	) {
		user_media_p2p.socket_input_name = 'p2p_user_media_message';
		//display_media_p2p.socket_input_name = 'p2p_display_media_message';

		// this.Logger.debug('call-service', 'user_media_p2p', user_media_p2p.sender_id, 'display_media_p2p', display_media_p2p.sender_id);

		this._assets = {
			_local_image_no_camera: 'https://avatarko.ru/img/kartinka/33/multfilm_lyagushka_32117.jpg',
			_remote_image_no_camera: 'https://avatarko.ru/img/kartinka/33/multfilm_lyagushka_32117.jpg',
		};
		this._user_media_constraints = {
			video: {
				width: { min: 1024, ideal: 1280, max: 1920 },
				height: { min: 576, ideal: 720, max: 1080 },
			},
			audio: true
		};
		socket.on('mediaStreamInfo', ( video: boolean ) => {
			this.Logger.debug('mediaStreamInfo', 'remoteStream', user_media_p2p.remote_media_stream?.getTracks().find(el => el.kind === 'video'));
			this._remote_image_no_camera = video ? undefined : this._assets._remote_image_no_camera;
		});
		user_media_p2p.isCallStarted.subscribe(() => {
			this.share_media_stream_info(media_devices.user_media);
			this.Logger.error('call-service', 'media_streams', this._media_streams);
		});

	}

	public set user_media_constraints(constraints: MediaStreamConstraints) {
		this._user_media_constraints = constraints;
	}

	public set sender_id(id: string | undefined) {
		this._sender_id = id;
	}

	public get sender_id(): string | undefined {
		return this._sender_id;
	}

	public set receiver_id(id: string | undefined) {
		this._receiver_id = id;
	}

	private add_media_stream(stream: MediaStreamElementModel): void {
		this._media_streams.push(stream);
	}

	public get media_streams(): MediaStreamElementModel[] {
		return this._media_streams;
	}

	public start_recording_user_media(): void {

	}

	public end_recording_user_media(): void {

	}

	public get receiver_id(): string | undefined {
		return this._receiver_id;
	}

	public get local_image_no_camera(): string | undefined {
		return this._local_image_no_camera;
	}

	public get remote_image_no_camera(): string | undefined {
		return this._remote_image_no_camera;
	}

	public get local_media_stream(): MediaStream | undefined {
		return this.user_media_p2p.local_media_stream;
	}

	public get remote_media_stream(): MediaStream | undefined {
		return this.user_media_p2p.remote_media_stream;
	}

	private share_media_stream_info(stream?: MediaStream): void {
		const videoTrack = stream?.getTracks().find(track => track.kind === 'video');
		this.Logger.debug('videoTrack', videoTrack);
		if(videoTrack) {
			this.socket.emit('mediaStreamInfo', {
				id: this._receiver_id,
				video: videoTrack.enabled
			});
			if(videoTrack.enabled) {
				this._local_image_no_camera = undefined;
			} else {
				this._local_image_no_camera = this._assets._local_image_no_camera;
			}

			return;
		}
		this._local_image_no_camera = this._assets._local_image_no_camera;
		this.socket.emit('mediaStreamInfo', {
			id: this._receiver_id,
			video: false
		});
	}

	public switch_user_media_audio(): void {
		this.media_devices.user_media_audio = !this.media_devices.user_media_audio;
		this.share_media_stream_info(this.media_devices.user_media);
	}

	public switch_user_media_video(): void {
		this.media_devices.user_media_video = !this.media_devices.user_media_video;
		this.share_media_stream_info(this.media_devices.user_media);
	}

	public start_outgoing_call(): void {

		const interval = setInterval(() => {
			const remote_stream = this._media_streams.find(el => el.type === 'remote_user_media');

			if(this.user_media_p2p.remote_media_stream !== undefined) {

				this.Logger.error('call-service', 'interval cleared', this.user_media_p2p.remote_media_stream.getTracks());

				clearInterval(interval);
			}

			if(remote_stream) {
				remote_stream.stream = this.user_media_p2p.remote_media_stream;
			} else {
				this._media_streams.push({
					type: 'remote_user_media',
					stream: this.user_media_p2p.remote_media_stream
				});
			}

		}, 20);

		this.Logger.debug('call-service', {
			sender_id: this._sender_id,
			receiver_id: this._receiver_id
		});

		if(this._sender_id && this._receiver_id && this._sender_id !== this._receiver_id) {
			this.media_devices.user_media_constraints = this._user_media_constraints;
			this.media_devices.initialize_user_media()
				.then(_ => {
					this.Logger.info('STREAM tracks', this.media_devices.user_media?.getTracks());

					const local_stream = this._media_streams.find(el => el.type === 'local_user_media');

					if(local_stream) {
						local_stream.stream = this.media_devices.user_media;

					} else {
						this._media_streams.push({
							type: 'local_user_media',
							stream: this.media_devices.user_media
						});
					}

					this.share_media_stream_info(this.media_devices.user_media);
					this.recorder.setStream(this.media_devices.user_media);
					this.Logger.debug('call-service', 'initialize-user-media', {
						sender: this._sender_id,
						receiver: this._receiver_id
					});
					this.user_media_p2p.sender_id = this._sender_id;
					this.Logger.debug('call-service', 'sender_id', this.sender_id, 'receiver_id', this.receiver_id);
					this.user_media_p2p.receiver_id = this._receiver_id;
					this.user_media_p2p.local_media_stream = this.media_devices.user_media;
					this.user_media_p2p.connect();

				});

			return;
		}

		this.Logger.debug('call-service', 'You can`t call your self');
	}

	// public start_screen_sharing() {
	//
	// 	const interval = setInterval(() => {
	// 		const remote_stream = this._media_streams.find(el => el.type === 'remote_display_media');
	//
	// 		if(this.display_media_p2p.remote_media_stream !== undefined) {
	//
	// 			this.Logger.error('call-service', 'media_streams', this._media_streams);
	//
	// 			this.Logger.error('call-service', 'interval cleared', this._media_streams);
	//
	// 			clearInterval(interval);
	// 		}
	//
	// 		if(remote_stream) {
	// 			remote_stream.stream = this.display_media_p2p.remote_media_stream;
	// 		} else {
	// 			this._media_streams.push({
	// 				type: 'remote_display_media',
	// 				stream: this.display_media_p2p.remote_media_stream
	// 			});
	// 		}
	//
	// 	}, 20);
	//
	// 	if(this._sender_id && this._receiver_id && this._sender_id !== this._receiver_id) {
	// 		this.media_devices.display_media_constraints = {
	// 			video: true,
	// 			audio: true
	// 		};
	// 		this.media_devices.initialize_display_media()
	// 			.then(_ => {
	// 				this.Logger.info('STREAM tracks', this.media_devices.display_media?.getTracks());
	//
	// 				const local_stream = this._media_streams.find(el => el.type === 'local_display_media');
	//
	// 				if(local_stream) {
	// 					local_stream.stream = this.media_devices.display_media;
	//
	// 				} else {
	// 					this._media_streams.push({
	// 						type: 'local_display_media',
	// 						stream: this.media_devices.display_media
	// 					});
	// 				}
	//
	// 				this.Logger.debug('call-service', 'initialize-display-media', {
	// 					sender: this._sender_id,
	// 					receiver: this._receiver_id
	// 				});
	// 				this.display_media_p2p.socket_input_name = 'p2p_display_media_message';
	// 				this.display_media_p2p.sender_id = this._sender_id;
	// 				this.Logger.debug('call-service', 'sender_id', this.sender_id, 'receiver_id', this.receiver_id);
	// 				this.display_media_p2p.receiver_id = this._receiver_id;
	// 				this.display_media_p2p.local_media_stream = this.media_devices.display_media;
	// 				this.display_media_p2p.connect();
	//
	// 				this.Logger.error('call-service', 'creator', this.display_media_p2p.is_call_creator, 'socket_name', this.display_media_p2p.socket_input_name);
	// 				this.Logger.error('call-service', 'media_streams', this._media_streams);
	//
	// 			});
	//
	// 		return;
	// 	}
	//
	// 	this.Logger.debug('call-service', 'You can`t screen sharing for your self');
	// }

	public ngOnDestroy() {
		this._media_streams.splice(0, this._media_streams.length);
		this.user_media_p2p.disconnect();
		//this.display_media_p2p.disconnect();
		this.Logger.error('call-service', 'destroyed');
	}

}
