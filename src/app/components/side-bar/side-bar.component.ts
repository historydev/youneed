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

@Component({
	selector: 'app-side-bar',
	templateUrl: './side-bar.component.html',
	styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

	private clicked:boolean = false;
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

	constructor(
		private elem: ElementRef
	) {

	}

	click() {
		this.clicked = !this.clicked;
		console.log(this.clicked);
		if(this.clicked) {
			this.elem.nativeElement.querySelector('.container').classList.add('sidebar_active');
			this.elem.nativeElement.querySelector('.container').classList.remove('sidebar_close');
			return;
		}
		this.elem.nativeElement.querySelector('.container').classList.remove('sidebar_active');
		this.elem.nativeElement.querySelector('.container').classList.add('sidebar_close');
	}

	ngOnInit(): void {
	}

}
