import {Component, Input, OnInit} from '@angular/core';
import {
	faClockFour
} from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-timer',
	templateUrl: './timer.component.html',
	styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

	private _timer = {
		hours: '00',
		minutes: '00',
		seconds: '00'
	}
	private readonly _icon;
	private _timer_color: string = '#fff';

	constructor() {
		this._icon = faClockFour;
	}

	get icon() {
		return this._icon;
	}

	get timer_color() {
		return this._timer_color;
	}

	@Input() set timer(timer) {
		this._timer = timer;
	}

	get timer() {
		const m = parseInt(this._timer.minutes);
		if(m < 50) {
			this._timer_color = '#fff';
		} else if(m >= 50 && m < 55) {
			this._timer_color = '#fcb851';
		} else if(m >= 55) {
			this._timer_color = '#FF392F';
		}
		return this._timer;
	}


	ngOnInit(): void {

	}

}
