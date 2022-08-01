import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {VideoCallComponent} from './components/video-call/video-call.component';
import {TestComponent} from './components/test/test.component';
import {VideoComponent} from './components/video/video.component';
import {LoggerComponent} from './components/logger/logger.component';
import {SearchEngineComponent} from './components/search-engine/search-engine.component';
import {KeysPipe} from "./pipes/keys.pipe";
import { HeaderComponent } from './components/header/header.component';
import {SocketIoModule, SocketIoConfig, Socket} from 'ngx-socket-io';
import {LoggerService} from "./services/logger/logger.service";

const config: SocketIoConfig = { url: 'http://localhost:4000', options: {} };

@NgModule({
	declarations: [
		AppComponent,
		VideoCallComponent,
		TestComponent,
		VideoComponent,
		LoggerComponent,
		SearchEngineComponent,
		KeysPipe,
  		HeaderComponent
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot([
			{path: '', component: LoggerComponent},
			{path: 'logger', component: LoggerComponent},
			{path: 'video-call/:userId/:companionId', component: VideoCallComponent},
			{path: '**', component: LoggerComponent}
		]),
		SocketIoModule.forRoot(config)
	],
	providers: [],
	bootstrap: [AppComponent]
})

export class AppModule {

	constructor(
		private socket: Socket,
		private Logger: LoggerService
	) {
		this.socket.on('connected', (id: string) => this.Logger.info('Socket connection id', id));
	}
}
