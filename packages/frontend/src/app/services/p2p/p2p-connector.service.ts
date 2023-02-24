import {EventEmitter, Injectable, OnInit} from '@angular/core';
import {Socket} from "ngx-socket-io";
import {MessageModel} from "../../models/p2p-connector/message.model";
import {LoggerService} from "../logger/logger.service";
import {HandleListModel} from "../../models/p2p-connector/handle-list.model";
import {Router} from "@angular/router";
import {ChatService} from "../../components/meetings/chat/services/chat/chat.service";

@Injectable({
	providedIn: 'root'
})
export class P2pConnectorService {

	private _sender_id?: string;
	private _receiver_id?: string;
	private _peer_connection?: RTCPeerConnection;
	private _local_media_stream?: MediaStream;
	private _remote_media_stream?: MediaStream;
	private _is_call_creator: Boolean = false;
	private _socket_input_name: string = 'p2p_user_media_message';
	private _sender_ready: Boolean = false;
	private _receiver_ready: Boolean = false;

	private readonly handleList: HandleListModel[] = [
		{
			type: 'ready',
			call: (msg: any) => this.handle_ready(),
		},
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
		private router: Router,
		private chat_service: ChatService
	) {
		this.socket.on(this._socket_input_name, (data: MessageModel<any>) => {
			this.Logger.debug('p2pService new message', data);
			const handler = this.handleList.find(el => el.type === data.type);
			if(handler) return handler.call(data.message);
			this.Logger.error('p2pService', 'Message type not found');
		});
	}

	public disconnect(): void {
		this.Logger.error('p2p-connector-service', 'disconnect');
		this.Logger.error('p2p-connector-service', 'Sender: ' + this._sender_id, 'Receiver: ' + this._receiver_id);
		this.socket.emit(this._socket_input_name, { id: this._receiver_id, type: 'disconnect', message: {} });
		this._receiver_ready = false;
		this._sender_ready = false;
		this.handle_disconnect();
	}

	public connect(): void {
		this._sender_ready = true;
		const interval = setInterval(() => {
			this.Logger.debug('p2p-connector-service', this._receiver_ready, this._socket_input_name, this._peer_connection);
			if(this._receiver_ready) {
				this.socket.emit(this._socket_input_name, {
					id: this.receiver_id,
					type: 'ready',
					message: 'ready'
				});
				if(this._is_call_creator) {
					this.Logger.debug('p2p-connector-service', 'try connect');
					// this.chat_service.send_message('Начало звонка', 'system');
					this.socket.emit(this._socket_input_name, { id: this._receiver_id, type: 'connected', message: {} });
				}
				clearInterval(interval);
			} else {
				this.socket.emit(this._socket_input_name, {
					id: this.receiver_id,
					type: 'ready',
					message: 'ready'
				});
			}
		}, 20);
	}

	private join_socket_room(): void {
		this.Logger.debug('p2p-connector-service', 'join-socket-room', {sender_id: this._sender_id, receiver_id: this._receiver_id});
		this.socket.emit('joinRoom', this._sender_id);
	}

	private leave_socket_room(): void {
		this.socket.emit('leaveRoom', this._sender_id);
		this.Logger.debug('p2p-connector-service', 'leave-socket-room', {sender_id: this._sender_id, receiver_id: this._receiver_id});
	}

	public set socket_input_name(val: string) {
		this._socket_input_name = val;
	}

	public get socket_input_name() {
		return this._socket_input_name;
	}

	public set is_call_creator(val: Boolean) {
		this._is_call_creator = val;
	}

	public get is_call_creator(): Boolean {
		return this._is_call_creator;
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
			this.Logger.error('initialize_connection', pc);
			const offer = await pc.createOffer({offerToReceiveVideo: true, offerToReceiveAudio: true});
			this.socket.emit(this._socket_input_name, {
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

		this._peer_connection?.close();
		this._peer_connection = undefined;

		this.Logger.info('p2p-connector', 'create_peer_connection', this._peer_connection);

		this._peer_connection = new RTCPeerConnection();
		this._peer_connection.onicecandidate = (e:RTCPeerConnectionIceEvent) => {

			if(e.candidate) {
				this.socket.emit(this._socket_input_name, {
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

			this.socket.emit(this._socket_input_name, {
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

	private handle_ready() {
		this.Logger.debug('p2p-connector-service', 'ready');
		this._receiver_ready = true;
	}

	private handle_disconnect(): void {
		this.router.navigate(['/meetings']).then(_ => {
			if (this._peer_connection?.signalingState !== 'closed') {
				this._peer_connection?.close();
				this._peer_connection = undefined;
			}
			this._local_media_stream?.getTracks().forEach(track => track.stop());
			this._local_media_stream = undefined;
			this._remote_media_stream = undefined;
			this.Logger.error('p2p-connector-service', 'handle_disconnect', this._peer_connection);
		});
	}

	private async handle_connect(): Promise<void> {
		this.Logger.error('p2p-connector-service', 'connect', this._peer_connection);
		if (this._peer_connection) {
			this.Logger.error('p2p-connector', 'handle_connect: ', 'Already in call');
			return;
		}
		this.initialize_connection().then();
	}

	private async handle_candidate(message: any): Promise<void> {
		this.isCallStarted.emit();
		if (!this._peer_connection) {
			this.Logger.error('p2p-connector', 'handle_candidate: ', 'no peerconnection');
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

			return;
		}
		this.Logger.error('p2p-connector', 'handle_answer', 'signaling state closed');
	}

	private async handle_offer(message: any): Promise<void> {
		if (this._peer_connection) {
			this.Logger.error('p2pService', 'handle offer: ', 'existing peerconnection');
			return;
		}
		await this.create_peer_connection().then(async pc => {
			this.Logger.error('handle_offer', pc);
			await pc.setRemoteDescription(message).catch(e => {
				this.Logger.error('setRemoteDescription 2', message, e);
			});

			const answer = await pc.createAnswer();
			await pc.setLocalDescription(answer);
			this.socket.emit(this._socket_input_name, { id: this._receiver_id, type: 'answer', message: { sdp: answer.sdp } });
		});
	}

}
