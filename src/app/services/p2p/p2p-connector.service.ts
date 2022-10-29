import {EventEmitter, Injectable, OnInit} from '@angular/core';
import {Socket} from "ngx-socket-io";
import {MessageModel} from "../../models/p2p-connector/message.model";
import {LoggerService} from "../logger/logger.service";
import {HandleListModel} from "../../models/p2p-connector/handle-list.model";
import {Router} from "@angular/router";

@Injectable({
	providedIn: 'root'
})
export class P2pConnectorService {

	private _sender_id?: string;
	private _receiver_id?: string;
	private _peer_connection?: RTCPeerConnection;
	private _local_media_stream?: MediaStream;
	private _remote_media_stream?: MediaStream;
	private readonly handleList: HandleListModel[] = [
		{
			type: 'connected',
			call: (msg: any) => this.handle_connect(),
		},
		{
			type: 'offer',
			call: (msg: any) => this.handle_offer(msg),
		},
		{
			type: 'answer',
			call: (msg: any) => this.handle_answer(msg),
		},
		{
			type: 'candidate',
			call: (msg: any) => this.handle_candidate(msg),
		},
		{
			type: 'disconnect',
			call: (msg: any) => this.handle_disconnect(),
		}
	];

	public isCallStarted: EventEmitter<any> = new EventEmitter<any>();

	constructor(
		private Logger: LoggerService,
		private socket: Socket,
		private router: Router
	) {
		this.socket.on('message', (data: MessageModel<any>) => {
			this.Logger.debug('p2pService new message', data);
			const handler = this.handleList.find(el => el.type === data.type);
			if(handler) return handler.call(data.message);
			this.Logger.error('p2pService', 'Message type not found');
		});
	}

	public get remote_media_stream(): MediaStream | undefined {
		return this._remote_media_stream;
	}

	public set local_media_stream(stream: MediaStream | undefined) {
		this._local_media_stream = stream;
	}

	public get local_media_stream(): MediaStream | undefined {
		return this._local_media_stream;
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

	public get receiver_id(): string | undefined {
		return this._receiver_id;
	}

	private async initialize_connection(): Promise<void> {
		await this.create_peer_connection().then(async pc => {
			this.Logger.info('initialize_connection', pc);
			const offer = await pc.createOffer({offerToReceiveVideo: true, offerToReceiveAudio: true});
			this.socket.emit('message', {
				id: this._receiver_id,
				type: 'offer',
				message: {
					sdp: offer?.sdp
				}
			});
			await pc.setLocalDescription(offer);
		});
	}

	private async create_peer_connection(): Promise<RTCPeerConnection> {

		this.Logger.info('createPeerConnection', this._peer_connection);

		this._peer_connection = new RTCPeerConnection();
		this._peer_connection.onicecandidate = (e:RTCPeerConnectionIceEvent) => {

			if(e.candidate) {
				this.socket.emit('message', {
					id: this._receiver_id,
					type: 'candidate',
					message: {
						candidate: e.candidate.candidate,
						sdpMid: e.candidate.sdpMid,
						sdpMLineIndex: e.candidate.sdpMLineIndex,
					}
				});

				return
			}

			this.socket.emit('message', {
				id: this._receiver_id,
				type: 'candidate',
				message: {
					candidate: undefined,
					sdpMid: undefined,
					sdpMLineIndex: undefined,
				}
			});

		}
		this._peer_connection.ontrack = e => {
			this.Logger.debug('streams', e.streams[0].getTracks());
			this._remote_media_stream = e.streams[0];
		}
		this._local_media_stream?.getTracks().forEach((track:MediaStreamTrack) => {
			if(this._local_media_stream) {
				this._peer_connection?.addTrack(track, this._local_media_stream);
			}
		});

		return this._peer_connection
	}

	private handle_disconnect(): void {
		if (this._peer_connection?.signalingState !== 'closed') {
			this._peer_connection?.close();
			this._peer_connection = undefined;
			this.Logger.error('p2p-connector-service', 'CLOSE PEER CONNECTION', this._peer_connection);
		}
		this._local_media_stream?.getTracks().forEach(track => track.stop());
		this._local_media_stream = undefined;
		this._remote_media_stream = undefined;
		this.Logger.error('p2p-connector-service', 'set pc undefined', this._peer_connection);
		this.router.navigate(['']).then();
	}

	private async handle_connect(): Promise<void> {
		if (this._peer_connection) {
			this.Logger.error('p2p-connector-service', 'peer-connection', this._peer_connection);
			this.Logger.error('P2pService ready', 'Already in call, ignoring');
			//return;
		}
		await this.initialize_connection();
	}

	private async handle_candidate(message: any): Promise<void> {
		this.isCallStarted.emit();
		if (!this._peer_connection) {
			this.Logger.error('p2pService', 'handleCandidate: ', 'no peerconnection');
			return;
		}
		if (this._peer_connection.signalingState !== 'closed') {
			if (!message.candidate) {

				await this._peer_connection?.addIceCandidate({
					candidate: undefined,
					sdpMid: undefined,
					sdpMLineIndex: undefined,
				}).catch(e => {
					this.Logger.error('addIceCandidate 1', e);
				});

				return;
			}
			await this._peer_connection?.addIceCandidate(message).catch(e => {
				this.Logger.error('addIceCandidate 2', 'message', message);
				this.Logger.error('addIceCandidate 2', e);
			});
		} else this.Logger.error('addIceCandidate 2', 'signaling state', this._peer_connection.signalingState);
	}

	private async handle_answer(message: any): Promise<void> {
		if (!this._peer_connection) {
			this.Logger.error('p2pService', 'handleAnswer: ', 'no peerconnection');
			return;
		}
		if(this._peer_connection.signalingState !== 'closed') {
			await this._peer_connection?.setRemoteDescription(message).catch(e => {
				this.Logger.error('setRemoteDescription 1', message, e);
			});
		}
	}

	private async handle_offer(message: any): Promise<void> {
		if (this._peer_connection) {
			this.Logger.error('p2pService', 'handle offer: ', 'existing peerconnection');
			//return;
		}
		await this.create_peer_connection().then(async pc => {
			await pc.setRemoteDescription(message).catch(e => {
				this.Logger.error('setRemoteDescription 2', message, e);
			});

			const answer = await pc.createAnswer();
			await pc.setLocalDescription(answer);
			this.socket.emit('message', { id: this._receiver_id, type: 'answer', message: { sdp: answer.sdp } });
		});
	}

	private join_socket_room(): void {
		this.Logger.debug('p2p-connector-service', 'join-socket-room', {sender_id: this._sender_id, receiver_id: this._receiver_id});
		this.socket.emit('joinRoom', this._sender_id);
	}

	private leave_socket_room(): void {
		this.socket.emit('leaveRoom', this._sender_id);
		this.Logger.debug('p2p-connector-service', 'leave-socket-room', {sender_id: this._sender_id, receiver_id: this._receiver_id});
	}

	public connect(): void {
		this.join_socket_room();
		this.socket.emit('message', { id: this._receiver_id, type: 'connected', message: {} });
		this.socket.emit('accept-call', {
			id: `${this._receiver_id}.-.${this._sender_id}`,
			type: 'outgoing',
			call: {
				sender_id: this._receiver_id,
				receiver_id: this._sender_id
			}
		});
	}

	public disconnect(): void {
		this.Logger.error('p2p-connector-service', 'disconnect');
		this.socket.emit('message', { id: this._receiver_id, type: 'disconnect', message: {} });
		// this.socket.emit('decline-call', {
		// 	id: `${this._receiver_id}.-.${this._sender_id}`,
		// 	type: 'outgoing',
		// 	call: {
		// 		sender_id: this._receiver_id,
		// 		receiver_id: this._sender_id
		// 	}
		// });
		this.handle_disconnect();
	}

	ngOnDestroy() {
		this.disconnect();
	}

}
