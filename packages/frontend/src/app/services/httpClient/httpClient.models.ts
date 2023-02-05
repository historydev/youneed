import {HttpContext, HttpHeaders, HttpParams} from "@angular/common/http";

type responseType = 'arraybuffer' | 'blob' | 'json' | 'text';
type params = HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string|number|boolean> };
type observe = 'body' | 'events' | 'response';
type httpHeaders = HttpHeaders | { [header: string]: string | string[] };

export interface HttpClientOptionsModel {
	headers?: httpHeaders,
	context?: HttpContext,
	observe?: observe,
	params?: params,
	reportProgress?: boolean,
	responseType?: responseType,
	withCredentials?: boolean,
}
