import {Injectable, OnInit} from '@angular/core';
import {Socket} from "ngx-socket-io";
import {MessageModel} from "../../models/p2p/message.model";
import {LoggerService} from "../logger/logger.service";
import {HandleListModel} from "../../models/p2p/handleList.model";
import {Location} from "@angular/common";

@Injectable({
	providedIn: 'root'
})
export class P2pService implements OnInit {

	private companionId?: string;
	private userId?: string;
	pc?: RTCPeerConnection;
	localStream?: MediaStream;
	remoteStream?: MediaStream;
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
		private location: Location
	) {
		this.socket.on('message', (data: MessageModel<any>) => {
			this.Logger.debug('p2pService new message', data);
			const elem = this.handleList.find(el => el.type === data.type);
			if(elem) return elem.call(data.message);
			this.Logger.error('p2pService', 'Message type not found');
		});
	}

	private async startCall(message: any): Promise<void> {
		await this.createPeerConnection();

		const offer = await this.pc?.createOffer();
		this.socket.emit('message', {
			id: this.companionId,
			type: 'offer',
			message: {
				sdp: offer?.sdp
			}
		});
		await this.pc?.setLocalDescription(offer);
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
					candidate: undefined
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

	private handleClose(message: any): void {
		if (this.pc) {
			this.pc.close();
			this.pc = undefined;
		}
		this.localStream?.getTracks().forEach(track => track.stop());
		this.localStream = undefined;
		this.location.go('');
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
			console.error('no peerconnection');
			return;
		}
		if (!message.candidate) {

			console.log('Candidate null');

			await this.pc?.addIceCandidate(undefined);
		} else {
			await this.pc?.addIceCandidate(message);
		}
	}

	private async handleAnswer(message: any): Promise<void> {
		if (!this.pc) {
			console.error('no peerconnection');
			return;
		}
		await this.pc?.setRemoteDescription(message);
	}

	private async handleOffer(message: any): Promise<void> {
		if (this.pc) {
			console.error('existing peerconnection');
			return;
		}
		await this.createPeerConnection().then(async pc => {
			await pc.setRemoteDescription(message);

			const answer = await pc.createAnswer();
			this.socket.emit('message', { id: this.companionId, type: 'answer', message: { sdp: answer.sdp } });
			await this.pc?.setLocalDescription(answer);
		});
	}

	public endCall() {
		this.remoteStream = undefined;
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

}
