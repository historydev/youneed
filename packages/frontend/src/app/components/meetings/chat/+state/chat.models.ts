import {EntityState} from "@ngrx/entity";
import {MessageResponseDto} from "./chat.dtos";

export interface MessageModel extends MessageResponseDto {
	is_owner: boolean;
}

export interface ChatStateModel extends EntityState<MessageModel> {
	loaded: boolean;
	loading: boolean;
}

