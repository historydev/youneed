import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Event, NavigationEnd, Router, RouterModule} from '@angular/router';
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
import {MeetingsComponent} from "../meetings/meetings.component";
import {MeetingsListComponent} from "../meetings-list/meetings-list.component";
import {ChatComponent} from "../chat/chat.component";
import {SideBarComponent} from "../side-bar/side-bar.component";
import all from '../../@NGRX/reducers/all';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AuthenticationComponent} from "../authentication/authentication.component";
import { environment } from '../../../environments/environment';
import {HttpClientModule} from "@angular/common/http";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {Location} from "@angular/common";
import { ExpertTapeComponent } from '../expert-tape/expert-tape.component';
import {MeetingsListService} from "../../services/meetings-list/meetings-list.service";
import { ModalComponent } from '../modal/modal.component';
import {ChatService} from "../../services/chat/chat.service";
import {TimerComponent} from "../timer/timer.component";


const config: SocketIoConfig = { url: environment.server_url, options: {} };
const routes = [
	{path: 'auth', component: AuthenticationComponent},
	{path: 'expert-tape', component: ExpertTapeComponent},
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
		AuthenticationComponent,
  		ExpertTapeComponent,
    	ModalComponent,
		TimerComponent
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
		HttpClientModule
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
		AuthenticationService,
		MeetingsListService,
		ChatService
	],
	bootstrap: [AppComponent]
})

export class AppModule {

	constructor(
		private socket: Socket,
		private Logger: LoggerService,
		private notifications: PushNotificationService,
		private router: Router,
		private auth: AuthenticationService,
		private location: Location,
		private meetings_service: MeetingsListService
	) {

		if(!auth.user) auth.check_user();

		if(!auth.user) {
			router.navigate(['/auth']).then();
		}

		let state = true;

		router.events.subscribe((event: Event) => {
			if(state) {
				state = false;
				setTimeout(() => {

					if(event instanceof NavigationEnd) {
						if(this.meetings_service.selected_meeting && !this.router.url.includes('call')) {
							this.meetings_service.select_meeting('');
						}
					}

					if(!auth.user) {
						router.navigate(['/auth']).then();
					} else {
						if(Date.now()/1000 >= auth.user.exp) {
							auth.user_expired();
							router.navigate(['/auth']).then();
						}
						if(router.url === '/auth') {
							console.log(auth.user);
							location.back();
						}
					}
					state = true;
				}, 300);

			}
		});

		this.socket.on('pushNotification', (data: NotificationModel) => {
			this.notifications.add(data);
		});

		this.socket.on('connected', (/*id: string*/) => {
			// this.Logger.info('Socket connection id', id);
			// this.notifications.add({
			// 	recipient: '1',
			// 	type: 'global',
			// 	title: 'WebSocket',
			// 	message: 'You are subscribed on ws server, your id: ' + id
			// });
		});

	}
}
