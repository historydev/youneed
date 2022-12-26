import {Component, ElementRef, OnInit} from '@angular/core';
import {
	faBars,
	faUserGroup,
	faComment,
	faUserCircle,
	faHeart,
	faCog,
	faInfoCircle,
	faKey,
	faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";
import {AuthenticationService} from "../../services/authentication/authentication.service";

@Component({
	selector: 'app-side-bar',
	templateUrl: './side-bar.component.html',
	styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

	public clicked:boolean = false;
	public icons = {
		faBars,
		faUserGroup,
		faComment,
		faUserCircle,
		faHeart,
		faCog,
		faInfoCircle,
		faKey,
		faQuestionCircle
	}
	private _user:any;
	public class_name:string = '';

	constructor(
		private elem: ElementRef,
		private auth: AuthenticationService
	) {
		auth.user_sub.subscribe(user => {
			this._user = user;
		});
	}

	public get user() {
		return this._user;
	}

	click() {
		this.clicked = !this.clicked;
		this.class_name = this.clicked ? 'sidebar_active' : 'sidebar_close';
		// if(this.clicked) {
		// 	this.elem.nativeElement.querySelector('.container').classList.add('sidebar_active');
		// 	this.elem.nativeElement.querySelector('.container').classList.remove('sidebar_close');
		// 	return;
		// }
		// this.elem.nativeElement.querySelector('.container').classList.remove('sidebar_active');
		// this.elem.nativeElement.querySelector('.container').classList.add('sidebar_close');
	}

	ngOnInit(): void {
	}

}
