import {MessageOutputModel} from "./message_output.model";

export interface MessageResponseModel {
	error?: any;
	message: MessageOutputModel;
}
