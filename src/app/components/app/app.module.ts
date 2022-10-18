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
import {P2pConnectorService} from "../../services/p2p/p2p-connector.service";
import {CallService} from "../../services/call/call.service";
import {MeetingsComponent} from "../meetings/meetings.component";
import {MeetingsListComponent} from "../meetings-list/meetings-list.component";
import {ChatComponent} from "../chat/chat.component";
import {SideBarComponent} from "../side-bar/side-bar.component";
import all from '../../@NGRX/reducers/all';

const prodUrl = '/';
const devUrl = 'http://localhost:4000';
const config: SocketIoConfig = { url: devUrl, options: {} };
const routes = [
	//{path: '', redirectTo: 'video', pathMatch: 'full', component: HomeComponent},
	{path: '', component: HomeComponent},
	{path: 'logger', component: LoggerComponent},
	{path: 'call/:receiver_id', component: CallComponent},
	{path: 'meetings', component: MeetingsComponent},
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
		MeetingsComponent,
		MeetingsListComponent,
		ChatComponent,
		SideBarComponent
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot(routes),
		SocketIoModule.forRoot(config),
		FontAwesomeModule,
		FormsModule,
		StoreModule.forRoot(all, {}),
	],
	providers: [
		LoggerService,
		{
			provide: 'user_media',
			useClass: P2pConnectorService
		},
		{
			provide: 'display_media',
			useClass: P2pConnectorService
		},
		CallService
	],
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
			// this.notifications.add({
			// 	recipient: '1',
			// 	type: 'global',
			// 	title: 'WebSocket',
			// 	message: 'You are subscribed on ws server, your id: ' + id
			// });
		});

	}
}
