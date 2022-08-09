import {Component, OnInit} from '@angular/core';
import {LoggerService} from "../../services/logger/logger.service";
import { prettyPrintJson } from 'pretty-print-json';

@Component({
	selector: 'app-logger',
	templateUrl: './logger.component.html',
	styleUrls: ['./logger.component.scss']
})
export class LoggerComponent implements OnInit {

	public prettyprint = prettyPrintJson;

	constructor(
		public Logger: LoggerService
	) {}

	ngOnInit(): void {
	}

}
