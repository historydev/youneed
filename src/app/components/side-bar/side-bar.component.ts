import {Component, ElementRef, OnInit} from '@angular/core';
import {
	faBars,
	faUserGroup,
	faComment,
	faUserCircle,
	faHeart,
	faCog,
	faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import {GlobalStoreService} from "../../services/global-store/global-store.service";

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
		faInfoCircle
	}

	constructor(
		private elem: ElementRef,
		private global_store: GlobalStoreService
	) {
		this.global_store.sidebar_display.subscribe(val => {
			if(!val) return this.elem.nativeElement.querySelector('.container').classList.add('sidebar_minimize');

			return this.elem.nativeElement.querySelector('.container').classList.remove('sidebar_minimize');
		});
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
