import {Injectable} from '@angular/core';
import {LoggerService} from "../logger/logger.service";
import {Socket} from "ngx-socket-io";
import {CallModel} from "../../models/call-window/call.model";
import {InitiateCallModel} from "../../models/call-window/initiate-call.model";
import {EndCallModel} from "../../models/call-window/end-call.model";
import {Router} from "@angular/router";

@Injectable({
	providedIn: 'root'
})
export class CallWindowService {

	public readonly calls: CallModel[] = [];
	public readonly currentCall: InitiateCallModel[] = [];

	constructor(
		private Logger: LoggerService,
		private socket: Socket,
		private router: Router
	) {
		socket.on('call', (call:CallModel) => {
			this.Logger.debug('CallWindowService', call);
			this.calls.push(call);
		});
		socket.on('acceptCall', async (initiator: string) => {
			await this.router.navigate(['/video/call/', initiator]);
		});
		socket.on('endCall', (call: EndCallModel) => {
			const index = this.calls.findIndex(callEl => callEl.recipient === call.recipient);
			if(this.currentCall[0] && this.currentCall[0].recipient === call.recipient) this.currentCall.shift();
			this.calls.splice(index, 1);
			this.Logger.debug('CallWindowService endCall', this.calls);
		});
	}

	public async accept(callData: InitiateCallModel): Promise<void> {
		this.Logger.debug('CallWindowService accept', callData.initiator);
		await this.router.navigate(['/video/call/', callData.initiator]);
	}

	public end(callData: EndCallModel): void {
		this.Logger.debug('CallWindowService end', callData);
		const index = this.calls.findIndex(callEl => callEl.recipient === callData.recipient);
		this.calls.splice(index, 1);
		this.currentCall.shift();
		this.Logger.debug('CallWindowService', this.currentCall, this.calls);
		this.socket.emit('endCall', callData);
	}

	public initiate(callData: InitiateCallModel): void {
		this.Logger.debug('CallWindowService initiate', callData);
		this.currentCall.push(callData);
		this.socket.emit('call', callData);
	}

}
