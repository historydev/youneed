import {Injectable} from '@angular/core';
import {LoggerService} from "../logger/logger.service";

@Injectable({
	providedIn: 'root'
})
export class GlobalStoreService {

	public userId?: string;

	constructor(
		private Logger: LoggerService
	) {}

}
