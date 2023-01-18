import {createAction, props} from "@ngrx/store";
import {MessageInputModel} from "../../models/chat/message_input.model";
import {MessageOutputModel} from "../../models/chat/message_output.model";

export const set_messages = createAction('[Chat Api] Set Messages', props<{messages: MessageOutputModel[]}>());
export const get_messages = createAction('[Chat Api] Get Messages');
export const add_message = createAction('[Chat Api] Add Message', props<{message: MessageOutputModel}>());
export const change_message_status = createAction('[Chat Api] Change Message Status', props<{msg: MessageOutputModel}>())
