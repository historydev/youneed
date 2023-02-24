import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { meetingsReducer } from './+state/reducers';
import { meetingsFeatureKey } from './+state/selectors';
import {MeetingsComponent} from "./meetings/meetings.component";
import {MeetingsEffects} from "./+state/effects";
import {EffectsModule} from "@ngrx/effects";
import {MeetingsListComponent} from "./meetings-list/meetings-list.component";
import {MeetingComponent} from "./meeting/meeting.component";
import {MeetingsListService} from "./services/meetings-list/meetings-list.service";
import {ChatComponent} from "./chat/chat/chat.component";
import {ChatService} from "./chat/services/chat/chat.service";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@NgModule({
	declarations: [
		MeetingsComponent,
		MeetingsListComponent,
		MeetingComponent,
		ChatComponent,
	],
	imports: [
		CommonModule,
		StoreModule.forFeature(meetingsFeatureKey, meetingsReducer),
		EffectsModule.forFeature([MeetingsEffects]),
		FontAwesomeModule,
	],
	providers: [
		MeetingsListService,
		ChatService
	],
	exports: [
		MeetingsComponent,
		MeetingsListComponent,
		MeetingComponent,
		ChatComponent,
		FontAwesomeModule,
	],
})
export class MeetingsModule {}
