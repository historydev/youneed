import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {HttpClientOptionsModel} from "./httpClient.models";
import {Observable} from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class HttpClientService {

	constructor(
		private http: HttpClient
	) {
		console.log(this.token);
	}

	public get<T>(url: string, options: HttpClientOptionsModel = {}): Observable<T> {
		return this.http.get<T>(environment.server_url + url, {
			observe: 'body',
			headers: {
				'Authentication': this.token
			},
			...options as Object
		});
	}

	public post<T>(url: string, body: Object | undefined,  options: HttpClientOptionsModel = {}): Observable<T> {
		return this.http.post<T>(environment.server_url + url, body, {
			observe: 'body',
			headers: {
				'Authentication': this.token
			},
			...options as Object
		});
	}

	private get token(): string {
		return document.cookie.split('; ').find((row) => row.startsWith('yn_token='))?.split('=')[1] || '';
	}

}
