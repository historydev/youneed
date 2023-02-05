import { createFeatureSelector, createSelector } from '@ngrx/store';
import {adapter} from "./reducers";
import {ChatStateModel} from "./chat.models";

export const chatFeatureKey = '[Chat/Api] Key';

export const selectChatState =
	createFeatureSelector<ChatStateModel>(chatFeatureKey);

const selector = <T>(mapping: (state: ChatStateModel) => T) =>
	createSelector(selectChatState, mapping);

const { selectAll, selectEntities } = adapter.getSelectors();
export const selectMessages = selector((state) => selectAll(state));
export const selectLoading = selector((state) => state.loading);
export const selectLoaded = selector((state) => state.loaded);
