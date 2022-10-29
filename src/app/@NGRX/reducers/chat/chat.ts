import {createReducer, on} from "@ngrx/store";
import {add_message, get_messages, set_messages} from "../../actions/chat";
import {MessageModel} from "../../../models/chat/message.model";

export const initialState:MessageModel[] = [];

export const messages_reducer = createReducer(
	initialState,
	on(set_messages, (state, {messages}) => {
		return messages
	}),
	on(get_messages, state => {
		console.log(state);
		return state
	}),
	on(add_message, (state, {message}) => {
		return [...state, message];
	}),
);
