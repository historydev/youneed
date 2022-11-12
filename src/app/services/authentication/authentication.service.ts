import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";
import {RegisterModel} from "../../models/authentication/register.model";
import {AuthModel} from "../../models/authentication/auth.model";
import {RegisterResponseModel} from "../../models/authentication/register_response.model";
import {AuthResponseModel} from "../../models/authentication/auth_response.model";
import {Socket} from "ngx-socket-io";
import {Location} from "@angular/common";

@Injectable({
	providedIn: 'root'
})
export class AuthenticationService {

	private _user?: AuthResponseModel['message'];
	private _user_sub: EventEmitter<AuthResponseModel['message']> = new EventEmitter<AuthResponseModel['message']>;

	constructor(
		private http: HttpClient,
		private router: Router,
		private socket: Socket,
		private location: Location
	) {}

	private next(data: AuthResponseModel['message']) {
		this.location.back();
		this._user = data;
		this.socket.emit('joinRoom', data.id);
		this._user_sub.emit(data);
	}

	private error(value: any) {
		this._user = undefined;
		this._user_sub.emit(undefined);
		document.cookie = '';
		console.error('error', value);
	}

	public get user(): AuthResponseModel['message'] | undefined {
		return this._user;
	}

	public get user_sub(): EventEmitter<AuthResponseModel['message']> {
		return this._user_sub;
	}

	public user_expired() {
		this.error(undefined);
	}

	public check_user() {
		const token = document.cookie
			.split('; ')
			.find((row) => row.startsWith('yn_token='))
			?.split('=')[1];

		const res = this.http.post<AuthResponseModel['message']>(environment.server_url + '/user', undefined, {
			observe: 'response',
			headers: {
				'Authentication': token || ''
			}
		});

		res.subscribe(response => {
			if(response.body) this.next(response.body);
		}, err => {
			if(err.status === 401) {
				this.error(err);
			}
			this.error(err);
		});
	}

	public login(data: AuthModel) {

		const res = this.http.post<AuthResponseModel>(environment.server_url + '/auth', data, {
			observe: 'response'
		});
		res.subscribe(response => {
			if(response.body) {
				if(response.body.error) {
					this.error(response.body.error);
					return;
				}
				this.next(response.body.message);
				document.cookie = `yn_token=${response.headers.get('Authentication')}`;
			}
		});

		return res;
	}

	public register(data: RegisterModel) {
		const res = this.http.post<RegisterResponseModel>(environment.server_url + '/register', data, {
			observe: 'response'
		});
		res.subscribe(response => {
			if(response.body) {
				if(response.body.error) {
					console.error(response.body.error)
					return;
				}
				console.log(response.body);
			}
		});

		return res;
	}

}
