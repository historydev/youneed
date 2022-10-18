import {EventEmitter, Injectable} from '@angular/core';
import {LoggerService} from "../logger/logger.service";
import {Socket} from "ngx-socket-io";

@Injectable({
	providedIn: 'root'
})
export class GlobalStoreService {

	public userId?: string;
	public sidebar_display: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(
		private Logger: LoggerService,
		private socket: Socket
	) {}

}
