import {Injectable} from '@angular/core';
import {LogsModel} from "../../models/logger/logs.model";

@Injectable({
	providedIn: 'root'
})

export class LoggerService {

	private __console?: Console;
	private __prefix: string = '%cLogger';
	private __styleGen: Function = (c: string, lastElem: boolean): string => {
		return `color: ${c}; background: #000; padding: 5px; font-weight: bold; border-right: ${lastElem ? 'none' : '1px solid #555'}`
	}
	public __logs?: LogsModel[] = [];

	constructor() {
		this.__console = console;
	}

	protected createLog(name: string = 'Created debug log', type: string = 'debug', ...args: any[]): string {
		const log = {name, type, message: args};
		log.name = name.replace('%c', '').replace('%c', ' ');
		log.type = type.replace('%c', ' ');
		this.__logs?.push(log);
		return name + type;
	}

	public error(name: string = '', ...args: any[]): void {
		this.__console?.error(
			this.createLog(this.__prefix + '%c' + name, '%cerror', ...args),
			this.__styleGen('#E4FF00'), // Prefix color
			this.__styleGen('#FFFFFF'), // Name color
			this.__styleGen('#FF3E2B', true), // Type color
			...args,
		);
	}

	public warn(name: string = '', ...args: any[]): void {
		this.__console?.warn(
			this.createLog(this.__prefix + '%c' + name, '%cwarn', ...args),
			this.__styleGen('#E4FF00'), // Prefix color
			this.__styleGen('#FFFFFF'), // Name color
			this.__styleGen('#FF9E00', true), // Type color
			...args,
		);
	}

	public info(name: string = '', ...args: any[]): void {
		this.__console?.info(
			this.createLog(this.__prefix + '%c' + name, '%cinfo', ...args),
			this.__styleGen('#E4FF00'), // Prefix color
			this.__styleGen('#FFFFFF'), // Name color
			this.__styleGen('#22F0FF', true), // Type color
			...args,
		);
	}

	public debug(name: string = '', ...args: any[]): void {
		this.__console?.log(
			this.createLog(this.__prefix + '%c' + name, '%cdebug', ...args),
			this.__styleGen('#E4FF00'), // Prefix color
			this.__styleGen('#FFFFFF'), // Name color
			this.__styleGen('#0CFF00', true), // Type color
			...args,
		);
	}

}
