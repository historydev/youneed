import {Injectable, OnInit} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {RecordModel} from "../../models/media-recorder/record.model";
import {LoggerService} from "../logger/logger.service";

@Injectable({
	providedIn: 'root'
})

export class MediaRecorderService implements OnInit {

	private mediaRecorder?: MediaRecorder;
	private options: Object = {
		mimeType: 'video/webm'
	}

	public record?:RecordModel;

	constructor(
		private sanitizer: DomSanitizer,
		private Logger: LoggerService
	) {}

	public ngOnInit(): void {

	}

	public setStream(stream: MediaStream | undefined, options:Object = this.options): void {
		if(stream) {
			const chunks: Blob[] = [];
			this.mediaRecorder = new MediaRecorder(stream, options);

			this.mediaRecorder?.addEventListener('dataavailable', (e:BlobEvent) => {
				chunks.push(e.data);
			});

			this.mediaRecorder?.addEventListener('start', () => {
				this.Logger.info('MediaRecorderService', 'MediaRecorder started');
			});

			this.mediaRecorder?.addEventListener('stop', () => {
				const blob = new Blob(chunks, { 'type' : 'video/webm' });
				const objectUrl = window.URL.createObjectURL( blob );
				this.record = {
					blob: blob,
					url: this.sanitizer.bypassSecurityTrustUrl(objectUrl)
				};
				console.log(blob)
				chunks.length = 0;
				this.Logger.info('MediaRecorderService', 'MediaRecorder stopped');
			});
		}
	}

	public stopRecording(): void {
		if(!this.mediaRecorder) return this.Logger.error('MediaRecorder', 'Stream is undefined');
		if(this.mediaRecorder?.state === 'recording') {
			this.mediaRecorder?.stop();

			return;
		}
		this.Logger.warn('MediaRecorder', 'MediaRecorder inactive');

	}

	public startRecording(): void {
		if(!this.mediaRecorder) return this.Logger.error('MediaRecorder', 'Stream is undefined');
		if(this.mediaRecorder?.state === 'inactive') {
			this.mediaRecorder?.start();

			return;
		}
		this.Logger.warn('MediaRecorder', 'MediaRecorder writes down')
	}

}
