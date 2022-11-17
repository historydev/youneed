import {Component, ElementRef, OnInit} from '@angular/core';
import {ButtonModel} from "../../models/modal/button.model";
import {ModalService} from "../../services/modal-service/modal.service";
import {ModalModel} from "../../models/modal/modal.model";

@Component({
	selector: 'app-modal',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

	constructor(
		private modal_service: ModalService,
		private elem: ElementRef
	) {

	}

	public remove_modal(modal_id: string): void {
		this.elem.nativeElement.querySelector('.container').classList.add('close');
		this.modal_service.remove_modal(modal_id);
	}

	public get modals(): ModalModel[] {
		return this.modal_service.modals;
	}

	ngOnInit(): void {
	}

}
