
export interface Call {
	title: string;
	sender_id: string;
	receiver_id: string;
}

export interface CallListElementModel {
	readonly id: string;
	readonly type: 'incoming' | 'outgoing';
	call: Call;
}
