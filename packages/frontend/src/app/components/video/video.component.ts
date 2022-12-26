import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {LoggerService} from "../../services/logger/logger.service";
import {SafeUrl} from "@angular/platform-browser";

@Component({
	selector: 'app-video',
	templateUrl: './video.component.html',
	styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

	@Input() mediaStream?: MediaStream;
	@Input() srcUrl?: SafeUrl;
	@Input() defaultView?: string = 'https://avatarko.ru/img/kartinka/33/multfilm_lyagushka_32117.jpg';
	@Input() muted?:boolean;
	@Input() controls?:boolean;

	constructor(
		private Logger: LoggerService
	) {}

	public ngOnInit(): void {}

	public ngOnChanges(changes: SimpleChanges): void {
		this.Logger.debug('video changes', changes['defaultView']?.currentValue, changes['defaultView']);
	}

	public getUrl(): SafeUrl | undefined {
		if(this.srcUrl) this.defaultView = undefined;
		return this.srcUrl
	}

	public getStream(): MediaStream | undefined {
		return this.mediaStream
	}

}
