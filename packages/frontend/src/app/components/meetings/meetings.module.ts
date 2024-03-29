import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { meetingsReducer } from './+state/reducers';
import { meetingsFeatureKey } from './+state/selectors';
import {MeetingsComponent} from "./meetings/meetings.component";
import {ChatService} from "./chat/services/chat/chat.service";
import {MeetingsService} from "./services/meetings/meetings.service";
import {MeetingComponent} from "./meeting/meeting.component";
import {MeetingsListComponent} from "./meetings-list/meetings-list.component";
import {ChatComponent} from "./chat/chat/chat.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {RouterLinkWithHref} from "@angular/router";
import { EffectsModule } from '@ngrx/effects';
import {MeetingsEffects} from "./+state/effects";

@NgModule({
	declarations: [
		MeetingsComponent,
		MeetingComponent,
		MeetingsListComponent,
		ChatComponent,
	],
    imports: [
        CommonModule,
        StoreModule.forFeature(meetingsFeatureKey, meetingsReducer),
		EffectsModule.forFeature([MeetingsEffects]),
        FontAwesomeModule,
        RouterLinkWithHref,
    ],
	providers: [
		ChatService,
		MeetingsService
	],
	exports: [
		MeetingsComponent,
		ChatComponent
	],
})
export class MeetingsModule {}
