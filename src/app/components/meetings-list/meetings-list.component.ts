import {Component, ElementRef, OnInit} from '@angular/core';

import {
	faCheck,
	faCheckDouble, IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import {MeetingsListService} from "../../services/meetings-list/meetings-list.service";
import {MeetingModel} from "../../models/meetings-list/meeting.model";
import {MessageModel} from "../../models/chat/message.model";

@Component({
	selector: 'app-meetings-list',
	templateUrl: './meetings-list.component.html',
	styleUrls: ['./meetings-list.component.scss']
})
export class MeetingsListComponent implements OnInit {

	public readonly icons = {
		faCheck,
		faCheckDouble
	}

	constructor(
		private meetings_service: MeetingsListService,
		private element: ElementRef
	) {

	}

	public select_meeting(id: string): void {
		const current_meeting = this.meetings_service.meetings.find(meeting => meeting.id === id);
		if(current_meeting && current_meeting.unread_messages_count > 0) current_meeting.unread_messages_count = 0;
		this.element.nativeElement.querySelectorAll('.meeting').forEach((meeting: HTMLElement) => {
			if(meeting.dataset['id'] === id) {
				meeting.classList.add('meeting_active');

				return;
			}
			meeting.classList.remove('meeting_active');
		});
		this.meetings_service.select_meeting(id);
	}

	public message_icon(message: MessageModel): IconDefinition {
		switch (message.status) {
			case 'sent': {
				return this.icons.faCheck;
			}
			case 'received': {
				return this.icons.faCheck;
			}
			case 'read': {
				return this.icons.faCheckDouble;
			}
			default: return this.icons.faCheck;
		}
	}

	public get meetings(): MeetingModel[] {
		return this.meetings_service.meetings;
	}

	ngOnInit(): void {
	}

}
