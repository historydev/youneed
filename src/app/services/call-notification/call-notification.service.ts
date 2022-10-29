import {Injectable} from '@angular/core';
import {LoggerService} from "../logger/logger.service";
import {Socket} from "ngx-socket-io";
import {Call, CallListElementModel} from "../../models/call-notification/call-list-element.model";
import {Router} from "@angular/router";

@Injectable({
	providedIn: 'root'
})
export class CallNotificationService {

	private readonly _calls_list: CallListElementModel[] = [];
	private readonly _calls_audio = {
		incoming: new Audio('../../assets/incoming-call.mp3'),
		outgoing: new Audio('../../assets/outgoing-call.mp3')
	}

	constructor(
		private Logger: LoggerService,
		private socket: Socket,
		private router: Router
	) {
		this._calls_audio.incoming.loop = true;
		this._calls_audio.outgoing.loop = true;

		socket.on('call', (data:CallListElementModel) => {
			this.Logger.debug('call-notification-service', 'call socket', data);
			this._calls_list.push({
				id: this.generate_call_id(data.call),
				type: 'incoming',
				call: data.call
			});
			//this._calls_audio.incoming.play().then();
		});
		socket.on('accept-call', async (data: CallListElementModel) => {
			this.Logger.debug('call-notification-service', 'accept call socket', data);
			const index = this._calls_list.findIndex(call => call.id === data.id);
			this._calls_list.splice(index, 1);
			this._calls_audio.incoming.pause();
			this._calls_audio.outgoing.pause();
			await this.router.navigate(['/video/call/', data.call.receiver_id]);
		});
		socket.on('decline-call', (data: CallListElementModel) => {
			this.Logger.debug('call-notification-service', 'decline call socket', data);
			const index = this._calls_list.findIndex(call => call.id === data.id);
			this._calls_list.splice(index, 1);
			this._calls_audio.incoming.pause();
			this._calls_audio.outgoing.pause();
		});
	}

	public get calls_list(): CallListElementModel[] {
		return this._calls_list;
	}

	private generate_call_id(call: Call): string {
		return `${call.sender_id}.-.${call.receiver_id}`;
	}

	public start_call(call: Call): void {
		this._calls_list.push({
			id: this.generate_call_id(call),
			type: 'outgoing',
			call: call
		});
		//this._calls_audio.outgoing.play().then();
		this.socket.emit('call', {
			id: this.generate_call_id(call),
			type: 'outgoing',
			call: call
		});
	}

	public accept_call(id: string): void {
		const call = this._calls_list.find(call => call.id === id);
		const index = this._calls_list.findIndex(call => call.id === id);
		if(call) {
			this._calls_audio.incoming.pause();
			//this.socket.emit('accept-call', call);
			this._calls_list.splice(index, 1);
			this.router.navigate(['/video/call/', call.call.sender_id]).then();
			return;
		}
		this.Logger.error('call-notification-service', 'accept call', 'Call not found');
	}

	public decline_call(id: string): void {
		const call = this._calls_list.find(call => call.id === id);
		const index = this._calls_list.findIndex(call => call.id === id);
		if(index > -1) {
			this.socket.emit('decline-call', call);
			this._calls_list.splice(index, 1);

			return;
		}
		this.Logger.error('call-notification-service', 'decline call', 'Call not found');
	}

}
