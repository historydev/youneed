import {Component, OnInit} from '@angular/core';
import {MeetingsListService} from "../../services/meetings-list/meetings-list.service";

@Component({
	selector: 'app-meetings',
	templateUrl: './meetings.component.html',
	styleUrls: ['./meetings.component.scss'],
	providers: [MeetingsListService]
})
export class MeetingsComponent implements OnInit {


	constructor() {
	}

	ngOnInit(): void {
	}

}
