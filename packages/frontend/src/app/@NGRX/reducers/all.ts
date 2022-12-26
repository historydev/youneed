
import {counterReducer} from "./counter/counter";
import {messages_reducer} from "./chat/chat";

export default {
	count: counterReducer,
	messages: messages_reducer
}
