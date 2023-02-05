import {Injectable} from '@angular/core';
import {ModalModel} from "../../models/modal/modal.model";

@Injectable({
	providedIn: 'root'
})
export class ModalService {

	private _modals: ModalModel[] = [];

	constructor(

	) {}

	public add_modal(modal: ModalModel): void {
		if(this._modals.length) this.remove_modal(this._modals[this._modals.length-1].id);
		this._modals.push(modal);
	}

	public remove_modal(modal_id: string, delay:number = 400): void {
		const index = this._modals.findIndex(({id}) => id === modal_id);
		setTimeout(() => this._modals.splice(index, 1), delay);
	}

	public get modals(): ModalModel[] {
		return this._modals;
	}

}
