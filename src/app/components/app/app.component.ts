import {Component, ElementRef, OnInit} from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'YouNeed - Добро Пожаловать!';

	constructor() {}

	ngOnInit() {

	}

}
