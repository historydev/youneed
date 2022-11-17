import {Inject, Injectable} from '@angular/core';
import {LoggerService} from "../logger/logger.service";
import {Socket} from "ngx-socket-io";
import {Call, CallListElementModel} from "../../models/call-notification/call_list_element.model";
import {Router} from "@angular/router";
import {P2pConnectorService} from "../p2p/p2p-connector.service";
import {AuthenticationService} from "../authentication/authentication.service";

@Injectable({
	providedIn: 'root'
})
export class CallNotificationService {

	private readonly _calls_list: CallListElementModel[] = [];
	private readonly _calls_audio = {
		incoming: new Audio('../../assets/incoming-call.mp3'),
		outgoing: new Audio('../../assets/outgoing-call.mp3')
	}
	private _in_call: Boolean = false;

	constructor(
		private Logger: LoggerService,
		private socket: Socket,
		private router: Router,
		@Inject('user_media') private user_media_p2p: P2pConnectorService,
		private auth: AuthenticationService
	) {
		this._calls_audio.incoming.loop = true;
		this._calls_audio.outgoing.loop = true;
		this._calls_audio.incoming.volume = 0.2;
		this._calls_audio.outgoing.volume = 0.2;

		socket.on('call', (data:CallListElementModel) => {
			this.Logger.debug('call-notification-service', 'call socket', data);
			if(this._in_call) {
				this.Logger.error('call-notification-service', 'start_call', 'Now user in call');
				return;
			}
			this._calls_list.push({
				id: this.generate_call_id(data.call),
				type: 'incoming',
				call: data.call
			});
			this._calls_audio.incoming.play().then();
		});
		socket.on('accept-call', async (data: CallListElementModel) => {
			this.Logger.debug('call-notification-service', 'accept call socket', data);
			const index = this._calls_list.findIndex(call => call.id === data.id);
			this._calls_list.splice(index, 1);
			this._calls_audio.incoming.pause();
			this._calls_audio.outgoing.pause();
			this.router.navigate(['call/', data.call.receiver_id]).then();
		});
		socket.on('decline-call', (data: CallListElementModel) => {
			this.Logger.debug('call-notification-service', 'decline call socket', data);
			const index = this._calls_list.findIndex(call => call.id === data.id);
			this._calls_list.splice(index, 1);
			this.router.navigate(['/meetings']).then();
			this._calls_audio.incoming.pause();
			this._calls_audio.outgoing.pause();
		});
	}

	public get in_call() {
		return this._in_call;
	}

	public set in_call(val: Boolean) {
		this._in_call = val;
	}

	public get calls_list(): CallListElementModel[] {
		return this._calls_list;
	}

	private generate_call_id(call: Call): string {
		return `${call.sender_id}-${call.receiver_id}`;
	}

	public start_call(call: Call): void {

		console.log(call);

		this._calls_list.push({
			id: this.generate_call_id(call),
			type: 'outgoing',
			call: call
		});
		this.user_media_p2p.is_call_creator = true;
		//this.display_media_p2p.is_call_creator = true;
		//this.router.navigate(['call/', call.receiver_id]);
		this._calls_audio.outgoing.play().then();
		this.socket.emit('call', {
			id: this.generate_call_id(call),
			type: 'incoming',
			call: {
				...call,
				title: `Вам звонит ${this.auth.user?.first_name} ${this.auth.user?.last_name[0]}.`
			}
		});

	}

	public accept_call(id: string): void {
		const call = this._calls_list.find(call => call.id === id);
		const index = this._calls_list.findIndex(call => call.id === id);
		if(call) {
			this.user_media_p2p.is_call_creator = false;
			this.socket.emit('accept-call', call);
			this._calls_list.splice(index, 1);
			if(!this._calls_list.length) {
				this._calls_audio.incoming.pause();
				this._calls_audio.outgoing.pause();
			}
			this.router.navigate(['call/', call.call.sender_id]).then();
			return;
		}
		this.Logger.error('call-notification-service', 'accept call', 'Call not found');
	}

	public decline_call(id: string): void {
		const call = this._calls_list.find(call => call.id === id);
		const index = this._calls_list.findIndex(call => call.id === id);
		if(call && index > -1) {
			this.socket.emit('decline-call', call);
			this.socket.emit('decline-call', {
				...call,
				call: {
					sender_id: call.call.receiver_id,
					receiver_id: call.call.sender_id,
				}
			});
			this._calls_list.splice(index, 1);
			if(!this._calls_list.length) {
				this._calls_audio.incoming.pause();
				this._calls_audio.outgoing.pause();
			}
			this.router.navigate(['/meetings']).then();
			return;
		}
		this.Logger.error('call-notification-service', 'decline call', 'Call not found');
	}

}
