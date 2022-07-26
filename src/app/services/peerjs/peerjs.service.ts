import {Injectable, OnInit} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {LoggerService} from "../logger/logger.service";
import {DataConnection, Peer, PeerJSOption} from 'peerjs';
import {CallMessageType, DataMessageType, PeerjsConnectionModel} from "../../models/peerjs/peerjs-connection.model";

@Injectable({
	providedIn: 'root'
})
export class PeerjsService implements OnInit {

	private peer?: Peer;
	private connection?: DataConnection
	private userId?:string;
	private companionId?:string;
	public remoteStream?:MediaStream;

	constructor(
		private socket: Socket,
		private Logger: LoggerService
	) {
		this.socket.emit('toServer', 'Hello server!');
		this.socket.on('fromServer', (data:any) => {
			//this.Logger.debug('peerjs from server', data);
		});
	}

	public createPeer(userId:string, companionId: string): void {
		this.userId = userId;
		this.companionId = companionId;
		this.peer = new Peer(userId);
	}

	public createConnection(options:PeerjsConnectionModel): void {
		const {type, data} = options;
		this.peer?.on('open', () => {
			this.Logger.debug('DataCall', data);
			if(type === 'data') return this.dataConnection(data);
			if(type === 'call') return this.callConnection(data);
		});
		this.peer?.on('call', call => {
			call.answer(data);
			call.on('stream', remote => {
				this.Logger.debug('RemotePeerStream', remote);
				this.remoteStream = remote;
			});
		});
	}

	private dataConnection(data:DataMessageType): void {
		if(this.companionId) {
			this.connection = this.peer?.connect(this.companionId);
			this.connection?.on('open', () => {
				this.sendMessage(data);
			});
			this.peer?.on("connection", (conn) => {
				conn.on("data", (data) => {
					// Will print 'hi!'
					this.Logger.info('Connection data', data);
				});
				conn.on("open", () => {
					conn.send("hello!");
				});
			});
		}
	}

	private callConnection(stream: MediaStream): void {
		if(this.companionId) {
			const call = this.peer?.call(this.companionId, stream);
			this.Logger.debug('Call log', call);
			call?.on('stream', remote => {
				this.Logger.debug('RemoteCallStream', remote);
				this.remoteStream = remote;
			});
		}
	}

	public sendMessage(message:DataMessageType): void {
		this.connection?.send(message);
	}

	public ngOnDestroy(): void {
		this.peer?.destroy();
	}

	public ngOnInit(): void {

	}

}
