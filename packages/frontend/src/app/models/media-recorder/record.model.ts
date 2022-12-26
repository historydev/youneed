import {SafeUrl} from "@angular/platform-browser";

export interface RecordModel {
	blob?: Blob | undefined;
	url?: SafeUrl | undefined;
}
