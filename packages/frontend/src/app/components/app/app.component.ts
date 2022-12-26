import {Component, ElementRef, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {ModalModel} from "../../models/modal/modal.model";
import {ModalService} from "../../services/modal-service/modal.service";
import {Router} from "@angular/router";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	private _user?: any;
	private _modals: ModalModel[];
	public route: string = '';

	constructor(
		private auth: AuthenticationService,
		private modal_service: ModalService,
		private router: Router
	) {
		router.events.subscribe(() => {
			this.route = router.url;
		});
		this._modals = modal_service.modals;
		auth.user_sub.subscribe(user => {
			this._user = user;
		});
	}

	public get modals(): ModalModel[] {
		return this._modals;
	}

	public get user() {
		return this._user;
	}

	ngOnInit() {

	}

}
