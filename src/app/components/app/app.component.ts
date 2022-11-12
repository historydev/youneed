import {Component, ElementRef, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentication/authentication.service";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	private _user?: any;

	constructor(
		private auth: AuthenticationService
	) {
		auth.user_sub.subscribe(user => {
			this._user = user;
		});
	}

	public get user() {
		return this._user;
	}

	ngOnInit() {

	}

}
