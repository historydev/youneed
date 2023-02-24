import {createReducer, on} from "@ngrx/store";
import {add_message, change_message_status, get_messages, set_messages} from "../../actions/chat";
import {MessageOutputModel} from "../../../models/chat/message_output.model";

export const initialState:MessageOutputModel[] = [];

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
	on(change_message_status, (state, {msg}) => {
		console.log(msg);
		console.log('MSG ID', msg);
		if(msg) {
			return state.map((el) => el._id === msg._id ? {...el, status: msg.status} : el);
		}
		return state
	})
);
