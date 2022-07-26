import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {LoggerService} from "../../services/logger/logger.service";
import {SafeUrl} from "@angular/platform-browser";
import {NgStyle} from "@angular/common";
import {StylesModel} from "../../models/video/styles.model";

@Component({
	selector: 'app-video',
	templateUrl: './video.component.html',
	styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

	@Input() mediaStream?: MediaStream | undefined;
	@Input() src?: SafeUrl | undefined;
	@Input() defaultView?: SafeUrl = 'https://avatarko.ru/img/kartinka/33/multfilm_lyagushka_32117.jpg';
	@Input() styles?: NgStyle;
	@Input() muted?:boolean;

	constructor(
		private Logger: LoggerService
	) {}

	public ngOnInit(): void {}

	public ngOnChange(): void {}

	public getUrl(): SafeUrl | undefined {
		if(this.src) this.defaultView = undefined;
		return this.src
	}

	public getStream(): MediaStream | undefined {
		if(this.mediaStream) {
			this.mediaStream?.getTracks().forEach(track => {
				if(track.kind === 'video') this.defaultView = undefined;
			});
		}
		return this.mediaStream
	}

}
