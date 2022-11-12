import {Component, OnInit} from '@angular/core';
import {ButtonModel} from "../../models/modal/button.model";

@Component({
	selector: 'app-modal',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

	private _buttons: ButtonModel[] = [
		{
			name: 'Отмена',
			onclick: () => {
				alert();
			},
			style: 'cancel'
		},
		{
			name: 'Начать разговор',
			onclick: () => {
				alert();
			},
			style: 'accept'
		},
	];
	private _title: string = 'Подтвердите действие';
	private _text_content: string = 'После начала разговора с вашей карты ****0134 будет списано 6500  рублей за час консультации.';

	public get title(): string {
		return this._title;
	}

	public get text_content(): string {
		return this._text_content;
	}

	public get buttons(): ButtonModel[] {
		return this._buttons;
	}

	constructor() {
	}

	ngOnInit(): void {
	}

}
