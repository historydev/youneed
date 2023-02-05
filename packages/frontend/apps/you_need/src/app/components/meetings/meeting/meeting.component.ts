import {Component, Input, OnInit} from '@angular/core';
import {MeetingModel} from "../../../models/meetings-list/meeting.model";
import {MemberModel} from "../../../models/meetings-list/member.model";
import {MessageOutputModel} from "../../../models/chat/message_output.model";
import {faCheck, faCheckDouble, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {SelectMeeting} from "../+state/actions";
import {Store} from "@ngrx/store";
import {AuthenticationService} from "../../../services/authentication/authentication.service";

@Component({
	selector: 'app-meeting',
	templateUrl: './meeting.component.html',
	styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnInit {

	@Input() meeting?: MeetingModel;
	public readonly icons = {
		faCheck,
		faCheckDouble
	}
	constructor(
		private store: Store,
		private auth: AuthenticationService,
	) {
	}

	public select_meeting(id: string): void {
		this.store.dispatch(SelectMeeting({id}));
	}

	public member_data(members: MemberModel[]) {
		return members.filter(member => member.id !== this.auth.user?.id)[0];
	}

	public message_icon(message: MessageOutputModel): IconDefinition {
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

	ngOnInit(): void {
	}

}
