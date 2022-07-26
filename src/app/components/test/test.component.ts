import {Component, OnInit} from '@angular/core';
import {MediaRecorderService} from "../../services/media-recorder/media-recorder.service";
import {RecordModel} from '../../models/media-recorder/record.model';

@Component({
	selector: 'app-test',
	templateUrl: './test.component.html',
	styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

	public stream?: MediaStream;
	public record?: RecordModel;
	private audio?:boolean = true;
	private video?:boolean = true;
	recorder?: any;

	constructor(
		public recorderService: MediaRecorderService,
	) {
		this.recorder = this.recorderService;
	}

	onOffVideo() {
		this.stream?.getVideoTracks().forEach(track => track.enabled = !track.enabled);
	}

	setRecord() {
		this.record = this.recorder.getRecord();
	}

	ngOnInit(): void {
		navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
			this.stream = stream;
			this.recorder.setStream(stream);
		}).catch(console.error);
	}

}
