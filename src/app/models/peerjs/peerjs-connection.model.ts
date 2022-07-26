
export type DataMessageType = any;
export type CallMessageType = MediaStream;

export interface PeerjsConnectionModel {
	type: 'call' | 'data',
	data: any
}
