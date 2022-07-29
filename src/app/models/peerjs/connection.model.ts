
export type DataMessageType = any;
export type CallMessageType = MediaStream;

export interface ConnectionModel {
	type: 'call' | 'data',
	data: any
}
