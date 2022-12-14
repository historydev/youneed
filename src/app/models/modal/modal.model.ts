import {ButtonModel} from "./button.model";

export interface ModalModel {
	id: string;
	title: string;
	text_content?: string;
	buttons: ButtonModel[];
}
