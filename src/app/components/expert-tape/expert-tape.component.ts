import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserModel} from "../../models/expert-tape/user.model";
import {UsersResponseModel} from "../../models/expert-tape/users_response.model";
import {environment} from "../../../environments/environment";
import {MeetingsListService} from "../../services/meetings-list/meetings-list.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {CallNotificationService} from "../../services/call-notification/call-notification.service";

@Component({
	selector: 'app-expert-tape',
	templateUrl: './expert-tape.component.html',
	styleUrls: ['./expert-tape.component.scss']
})
export class ExpertTapeComponent implements OnInit {

	private _users: UserModel[] = [];

	constructor(
		private http: HttpClient,
		private meetings_list_service: MeetingsListService,
		private router: Router,
		private auth: AuthenticationService
	) {

		const token = document.cookie
			.split('; ')
			.find((row) => row.startsWith('yn_token='))
			?.split('=')[1];

		http.post<UsersResponseModel>(environment.server_url + '/users', undefined, {
			observe: 'response',
			headers: {
				'Content-Type': 'application/json',
				'Authentication': token || ''
			}
		}).subscribe(res => {
			if(res.body) this._users = res.body.message;
		}, err => {
			console.log(err);
		})
	}

	public get users(): UserModel[] {
		return this._users;
	}

	public write_message(user: UserModel) {

		this.meetings_list_service.create_meeting({
			id: 'temporary',
			type: 'private',
			members: [ user ],
			unread_messages_count: 0,
		});

		// @ts-ignore
		const meeting = this.meetings_list_service.meetings.find(m => m.members.includes(user.id) && m.members.includes(this.auth.user?.id));

		if(!meeting) this.meetings_list_service.receivers = [user.id];

		this.router.navigate(['/meetings']).then(_ => {
			this.meetings_list_service.select_meeting('temporary');
		});
	}

	ngOnInit(): void {
	}

}
