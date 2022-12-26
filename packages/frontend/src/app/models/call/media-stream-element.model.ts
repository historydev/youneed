
type MediaStreamType = 'local_user_media' | 'local_display_media' | 'remote_user_media' | 'remote_display_media';

export interface MediaStreamElementModel {
	type: MediaStreamType,
	stream: MediaStream | undefined,
}
