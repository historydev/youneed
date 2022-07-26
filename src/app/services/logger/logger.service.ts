import {Injectable} from '@angular/core';
import {LogsModel} from "../../models/logger/logs.model";

@Injectable({
	providedIn: 'root'
})

export class LoggerService {

	private __console?: Console;
	public __logs?: LogsModel[] = [];

	constructor() {
		this.__console = console;
	}

	protected createLog(name: string = 'Initial', type: string = 'debug', message: any = 'Empty debug log'): LogsModel {
		const log = { name, type, message };
		this.__logs?.push(log);
		return log;
	}

	public error(name:string = '', message:any = ''): void {
		this.__console?.error(
			'Logger: ',
			this.createLog(name, 'error', message + '')
		);
	}

	public warn(name:string = '', message:any = ''): void {
		this.__console?.warn(
			'Logger: ',
			this.createLog(name, 'warn', message)
		);
	}

	public info(name:string = '', message:any = ''): void {
		this.__console?.info(
			'Logger: ',
			this.createLog(name, 'info', message)
		);
	}

	public debug(name:string = '', message:any = ''): void {
		this.__console?.log(
			'Logger: ',
			this.createLog(name, 'debug', message)
		);
	}

}
