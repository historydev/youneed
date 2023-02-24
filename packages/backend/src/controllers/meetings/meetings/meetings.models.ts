import {MessageModel} from "../messages/messages.models";
import {CallModel} from "../calls/calls.models";

export interface MeetingMemberModel {
    id: string;
    firstName: string;
    lastName: string;
    image: string;
    expert: boolean;
}

export interface MeetingModel  {
    id: string;
    type: 'private' | 'group';
    members: MeetingMemberModel[];
    calls: CallModel[];
    messages: MessageModel[];
    unreadMessagesCount: number;
}