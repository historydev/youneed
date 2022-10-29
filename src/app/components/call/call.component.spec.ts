import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CallComponent} from './call.component';
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import {RouterModule} from "@angular/router";
import {HomeComponent} from "../home/home.component";
import {LoggerComponent} from "../logger/logger.component";

describe('VideoCallComponent', () => {
	let component: CallComponent;
	let fixture: ComponentFixture<CallComponent>;
	const config: SocketIoConfig = { url: 'http://localhost:4000', options: {} };
	const routes = [
		//{path: '', redirectTo: 'video', pathMatch: 'full', component: HomeComponent},
		{path: 'video', component: HomeComponent},
		{path: 'video/logger', component: LoggerComponent},
		{path: 'video/call/:companionId', component: CallComponent},
		{path: '**', component: HomeComponent}
	];

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				SocketIoModule.forRoot(config),
				RouterModule.forRoot(routes),
			],
			declarations: [CallComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(CallComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
