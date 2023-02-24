import {WithId} from "mongodb";
import {MeetingMemberModel, MeetingModel} from "./meetings.models";
import {CallModel} from "../calls/calls.models";
import {MessageModel} from "../messages/messages.models";

export interface MeetingResponseFromMongoDto extends MeetingModel, WithId<Document> {}
export interface MeetingResponseDto extends MeetingModel {}

export interface MeetingCreateDto {
    members: MeetingMemberModel[];
}

export interface MeetingUpdateDto {
    id: string;
    members?: MeetingMemberModel[];
    calls?: CallModel[];
    messages?: MessageModel[];
    unreadMessagesCount?: number;
}