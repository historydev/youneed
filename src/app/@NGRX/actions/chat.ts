import {createAction, props} from "@ngrx/store";

const meeting_messages = createAction('[Chat Api] Success Get Messages', props<{receiver_id: string;}>);
