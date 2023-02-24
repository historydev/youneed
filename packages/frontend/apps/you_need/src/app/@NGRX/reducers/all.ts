
import {messages_reducer} from "./chat/chat";
import {meetingsReducer} from "../../components/meetings/+state/reducers";

export default {
	messages: messages_reducer,
	meetings: meetingsReducer
}
