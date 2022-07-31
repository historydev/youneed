import {Injectable, OnInit} from '@angular/core';
import {Socket} from "ngx-socket-io";
import {MessageModel} from "../../models/p2p/message.model";
import {LoggerService} from "../logger/logger.service";
import {HandleListModel} from "../../models/p2p/handleList.model";
import {Location} from "@angular/common";
import {Router} from "@angular/router";

@Injectable({
	providedIn: 'root'
})
export class P2pService implements OnInit {

	private companionId?: string;
	private userId?: string;
	public pc?: RTCPeerConnection;
	public localStream?: MediaStream;
	public remoteStream?: MediaStream;
	private readonly handleList: HandleListModel[] = [
		{
			type: 'ready',
			call: (msg: any) => this.handleReady(msg),
		},
		{
			type: 'offer',
			call: (msg: any) => this.handleOffer(msg),
		},
		{
			type: 'answer',
			call: (msg: any) => this.handleAnswer(msg),
		},
		{
			type: 'candidate',
			call: (msg: any) => this.handleCandidate(msg),
		},
		{
			type: 'close',
			call: (msg: any) => this.handleClose(msg),
		}
	]

	constructor(
		private Logger: LoggerService,
		private socket: Socket,
		private router: Router
	) {
		this.socket.on('message', (data: MessageModel<any>) => {
			this.Logger.debug('p2pService new message', data);
			const elem = this.handleList.find(el => el.type === data.type);
			if(elem) return elem.call(data.message);
			this.Logger.error('p2pService', 'Message type not found');
		});
	}

	private async startCall(message: any): Promise<void> {
		await this.createPeerConnection().then(async pc => {

			this.Logger.debug('peerConnection', this.pc, pc);

			const offer = await pc.createOffer();
			this.socket.emit('message', {
				id: this.companionId,
				type: 'offer',
				message: {
					sdp: offer?.sdp
				}
			});
			await pc.setLocalDescription(offer);
		});
	}

	private async createPeerConnection(): Promise<RTCPeerConnection> {
		this.pc = new RTCPeerConnection();
		this.pc.onicecandidate = (e:RTCPeerConnectionIceEvent) => {

			if(e.candidate) {
				this.socket.emit('message', {
					id: this.companionId,
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
				id: this.companionId,
				type: 'candidate',
				message: {
					candidate: null
				}
			});

		}
		this.pc.ontrack = e => this.remoteStream = e.streams[0];
		this.localStream?.getTracks().forEach((track:MediaStreamTrack) => {
			if(this.localStream) {
				this.pc?.addTrack(track, this.localStream);
			}
		});

		return this.pc
	}

	private async handleClose(message: any): Promise<void> {
		if (this.pc?.signalingState !== 'closed') {
			this.pc?.close();
		}
		this.localStream?.getTracks().forEach(track => track.stop());
		this.localStream = undefined;
		this.remoteStream = undefined;
		this.socket.emit('leaveRoom', this.userId);
		await this.router.navigate(['']);
	}

	private async handleReady(message: any): Promise<void> {
		if (this.pc) {
			this.Logger.info('P2pService ready', 'Already in call, ignoring');
			return;
		}
		await this.startCall(message);
	}

	private async handleCandidate(message: any): Promise<void> {
		console.log('Candidate', message)

		if (!this.pc) {
			this.Logger.error('p2pService', 'handleCandidate: ', 'no peerconnection');
			return;
		}
		if (!message.candidate) {

			console.log('Candidate null');

			if(this.pc.signalingState !== 'closed') {
				await this.pc?.addIceCandidate({
					candidate: undefined
				}).catch(e => {
					this.Logger.error('addIceCandidate 1', e);
				});
			}

		} else {
			if(this.pc.signalingState !== 'closed') {
				await this.pc?.addIceCandidate(message).catch(e => {
					this.Logger.error('addIceCandidate 2', e);
				});
			}
		}
	}

	private async handleAnswer(message: any): Promise<void> {
		if (!this.pc) {
			this.Logger.error('p2pService', 'handleAnswer: ', 'no peerconnection');
			return;
		}
		if(this.pc.signalingState !== 'closed') {
			await this.pc?.setRemoteDescription(message).catch(e => {
				this.Logger.error('setRemoteDescription 1', {
					error: e,
					message
				});
			});
		}
	}

	private async handleOffer(message: any): Promise<void> {
		if (this.pc) {
			this.Logger.info('p2pService', 'handle offer: ', 'existing peerconnection');
			return;
		}
		await this.createPeerConnection().then(async pc => {
			await pc.setRemoteDescription(message).catch(e => {
				this.Logger.error('setRemoteDescription 2', {
					error: e,
					message
				});
			});

			const answer = await pc.createAnswer();
			await pc.setLocalDescription(answer);
			this.socket.emit('message', { id: this.companionId, type: 'answer', message: { sdp: answer.sdp } });
		});
	}

	public endCall() {
		this.socket.emit('message', { id: this.companionId, type: 'close', message: {} });
	}

	public joinRoom(userId: string, companionId: string): void {
		this.Logger.debug('joinRoom', {userId, companionId});
		this.userId = userId;
		this.companionId = companionId;
		this.socket.emit('joinRoom', userId);
	}

	public setLocalStream(stream: MediaStream): void {
		this.Logger.debug('MediaStream', stream);
		this.localStream = stream;
		this.socket.emit('message', { id: this.companionId, type: 'ready', message: {} });
	}

	public ngOnInit(): void {

	}

	public ngOnDestroy() {
		this.socket.emit('message', { id: this.companionId, type: 'close', message: {} });
		this.handleClose('');
		this.Logger.info('p2pService', 'destroyed');
	}

}
