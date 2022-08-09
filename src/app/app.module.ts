import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {VideoCallComponent} from './components/video-call/video-call.component';
import {VideoComponent} from './components/video/video.component';
import {LoggerComponent} from './components/logger/logger.component';
import {SearchEngineComponent} from './components/search-engine/search-engine.component';
import {KeysPipe} from "./pipes/keys.pipe";
import { HeaderComponent } from './components/header/header.component';
import {SocketIoModule, SocketIoConfig, Socket} from 'ngx-socket-io';
import {LoggerService} from "./services/logger/logger.service";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonComponent } from './components/ui/button/button.component';
import { PushNotificationComponent } from './components/push-notification/push-notification.component';
import {PushNotificationService} from "./services/push-notification/push-notification.service";
import { HomeComponent } from './components/home/home.component';
import {FormsModule} from "@angular/forms";
import {NotificationModel} from "./models/push-notification/notification.model";

const prodUrl = 'https://you-need.ru';
const devUrl = 'http://localhost:4000';
const config: SocketIoConfig = { url: devUrl, options: {} };
const routes = [
	//{path: '', redirectTo: 'video', pathMatch: 'full', component: HomeComponent},
	{path: 'video', component: HomeComponent},
	{path: 'video/logger', component: LoggerComponent},
	{path: 'video/call/:companionId', component: VideoCallComponent},
	{path: '**', component: HomeComponent}
];

@NgModule({
	declarations: [
		AppComponent,
		VideoCallComponent,
		VideoComponent,
		LoggerComponent,
		SearchEngineComponent,
		KeysPipe,
  		HeaderComponent,
    	ButtonComponent,
		PushNotificationComponent,
		HomeComponent,
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot(routes),
		SocketIoModule.forRoot(config),
		FontAwesomeModule,
		FormsModule,
	],
	providers: [],
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
