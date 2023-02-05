import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {HttpClientOptionsModel} from "./httpClient.models";

@Injectable({
	providedIn: 'root'
})
export class HttpClientService {

	constructor(
		private http: HttpClient
	) {}

	public get<T>(url: string, options: HttpClientOptionsModel = {}) {
		return this.http.get<T>(url, {
			observe: 'body',
			headers: {
				'Authentication': this.token
			},
			...options as any
		});
	}

	public post<T>(url: string, body: Object | undefined,  options: HttpClientOptionsModel = {}) {
		return this.http.get<T>(url, {
			observe: 'body',
			headers: {
				'Authentication': this.token
			},
			...options as any
		});
	}

	private get token(): string {
		return document.cookie.split('; ').find((row) => row.startsWith('yn_token='))?.split('=')[1] || '';
	}

}
