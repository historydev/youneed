
import {TestBed} from '@angular/core/testing';

import {P2pConnectorService} from './p2p-connector.service';
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import {LoggerComponent} from "../../components/logger/logger.component";
import {RouterModule} from "@angular/router";
import {HomeComponent} from "../../components/home/home.component";
import {CallComponent} from "../../components/call/call.component";

describe('P2pService', () => {
	let service: P2pConnectorService;
	const config: SocketIoConfig = {url: 'http://localhost:4000', options: {}};
	const routes = [
		{path: 'video/logger', component: LoggerComponent},
		{path: 'video/call/:companionId', component: CallComponent},
	];

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				SocketIoModule.forRoot(config),
				RouterModule.forRoot(routes),
			],
			declarations: [CallComponent]
		});
		service = TestBed.inject(P2pConnectorService);
		service.sender_id = '1';
		service.receiver_id = '2';
		service.local_media_stream = new MediaStream();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('members setters', () => {
		expect(service.sender_id).toBe('1');
		expect(service.receiver_id).toBe('2');
	});

	it('have local stream', () => {
		expect(service.local_media_stream).toBeTruthy();
	});

	it('connected', () => {
		expect(service.connect()).toBeTruthy();
	});

	it('disconnected', () => {
		expect(service.disconnect()).toBe(undefined);
	});
});
