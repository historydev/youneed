import {Component, OnInit} from '@angular/core';
import {LoggerService} from "../../services/logger/logger.service";

@Component({
	selector: 'app-logger',
	templateUrl: './logger.component.html',
	styleUrls: ['./logger.component.scss']
})
export class LoggerComponent implements OnInit {

	constructor(
		public Logger: LoggerService
	) {}

	ngOnInit(): void {
	}

}
