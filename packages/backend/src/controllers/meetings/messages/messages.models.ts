export interface MessageModel {
    id: string;
    type: 'user' | 'system';
    meetingId: string;
    senderId: string;
    date: string;
    time: string;
    fullDate: Date;
    message: string;
    attachments: string[];
    isOwner: boolean;
    status: 'sent' | 'received' | 'read';
}