import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import {ChatStateModel, MessageModel} from "./chat.models";

export const adapter: EntityAdapter<MessageModel> =
	createEntityAdapter<MessageModel>({
		selectId: ({id}) => id,
	});

export const initialState: ChatStateModel = adapter.getInitialState({
	loaded: false,
	loading: false,
});
