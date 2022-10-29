import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {CallComponent} from '../call/call.component';
import {VideoComponent} from '../video/video.component';
import {LoggerComponent} from '../logger/logger.component';
import {SearchEngineComponent} from '../search-engine/search-engine.component';
import {KeysPipe} from "../../pipes/keys.pipe";
import { HeaderComponent } from '../header/header.component';
import {SocketIoModule, SocketIoConfig, Socket} from 'ngx-socket-io';
import {LoggerService} from "../../services/logger/logger.service";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonComponent } from '../UI/button/button.component';
import { PushNotificationComponent } from '../push-notification/push-notification.component';
import {PushNotificationService} from "../../services/push-notification/push-notification.service";
import { HomeComponent } from '../home/home.component';
import {FormsModule} from "@angular/forms";
import {NotificationModel} from "../../models/push-notification/notification.model";
import { CallNotificationComponent } from '../call-notification/call-notification.component';

import { StoreModule } from '@ngrx/store';
import { createAction } from '@ngrx/store';
import { createReducer, on } from '@ngrx/store';
import {P2pConnectorService} from "../../services/p2p/p2p-connector.service";
import {CallService} from "../../services/call/call.service";
import {CallNotificationService} from "../../services/call-notification/call-notification.service";

export const increment = createAction('[Counter Component] Increment');
export const decrement = createAction('[Counter Component] Decrement');
export const reset = createAction('[Counter Component] Reset');

export const initialState = 0;

export const counterReducer = createReducer(
	initialState,
	on(increment, (state) => state + 1),
	on(decrement, (state) => state - 1),
	on(reset, (state) => 0)
);

const prodUrl = '/';
const devUrl = 'http://localhost:4000';
const config: SocketIoConfig = { url: devUrl, options: {} };
const routes = [
	//{path: '', redirectTo: 'video', pathMatch: 'full', component: HomeComponent},
	{path: 'video', component: HomeComponent},
	{path: 'video/logger', component: LoggerComponent},
	{path: 'video/call/:receiver_id', component: CallComponent},
	{path: '**', component: HomeComponent}
];

@NgModule({
	declarations: [
		AppComponent,
		CallComponent,
		VideoComponent,
		LoggerComponent,
		SearchEngineComponent,
		KeysPipe,
  		HeaderComponent,
    	ButtonComponent,
		PushNotificationComponent,
		HomeComponent,
  		CallNotificationComponent,
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot(routes),
		SocketIoModule.forRoot(config),
		StoreModule.forRoot({ count: counterReducer }),
		FontAwesomeModule,
		FormsModule,
		StoreModule.forRoot({}, {}),
	],
	providers: [LoggerService, P2pConnectorService],
	bootstrap: [AppComponent]
})

export class AppModule {

	constructor(
		private socket: Socket,
		private Logger: LoggerService,
		private notifications: PushNotificationService
	) {

		this.socket.on('pushNotification', (data: NotificationModel) => {
			this.notifications.add(data);
		});

		this.socket.on('connected', (id: string) => {
			this.Logger.info('Socket connection id', id);
			this.notifications.add({
				recipient: '1',
				type: 'global',
				title: 'WebSocket',
				message: 'You are subscribed on ws server, your id: ' + id
			});
		});

	}
}
