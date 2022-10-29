import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Router, RouterModule} from '@angular/router';

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
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
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
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AuthorizationComponent} from "../authorize/authorization.component";

const prodUrl = '/';
const devUrl = 'http://localhost:4000';
const config: SocketIoConfig = { url: devUrl, options: {} };
const routes = [
	{path: 'auth', component: AuthorizationComponent},
	{path: 'home', component: HomeComponent, data: { animation: 'openClose' }},
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
		SideBarComponent,
		AuthorizationComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		RouterModule.forRoot(routes),
		SocketIoModule.forRoot(config),
		FontAwesomeModule,
		FormsModule,
		StoreModule.forRoot(all, {}),
		ReactiveFormsModule,
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
		private notifications: PushNotificationService,
		private router: Router
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
