import {createAction, props} from "@ngrx/store";
import {MessageModel} from "../../models/chat/message.model";

export const set_messages = createAction('[Chat Api] Set Messages', props<{messages: MessageModel[]}>());
export const get_messages = createAction('[Chat Api] Get Messages');
export const add_message = createAction('[Chat Api] Add Message', props<{message: MessageModel}>());


