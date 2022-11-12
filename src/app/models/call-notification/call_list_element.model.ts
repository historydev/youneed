
export interface Call {
	sender_id: string;
	receiver_id: string;
}

export interface CallListElementModel {
	readonly id: string;
	readonly type: 'incoming' | 'outgoing';
	call: Call;
}
