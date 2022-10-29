import {Component, OnInit} from '@angular/core';
import {
	AbstractControl, Form,
	FormControl,
	FormGroup, ValidationErrors, ValidatorFn,
	Validators
} from "@angular/forms";

import {faCircleExclamation} from "@fortawesome/free-solid-svg-icons";

class CustomValidators {
	static MatchValidator(source: string, target: string): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const sourceCtrl = control.get(source);
			const targetCtrl = control.get(target);

			return sourceCtrl?.value !== targetCtrl?.value ? { mismatch: true } : null;
		};
	}
}

@Component({
	selector: 'app-authorize',
	templateUrl: './authorization.component.html',
	styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {

	private _form_type: boolean = false;
	private readonly _register_form: FormGroup;
	private readonly _auth_form: FormGroup;
	private _validation_errors = [

	];
	public icons = {
		faCircleExclamation
	}

	constructor() {

		//~`@#$%^&*()-_=+[]'":;?/\|<>,

		this._register_form = new FormGroup(
			{
				first_name: new FormControl('', [
					Validators.required,
					Validators.minLength(3),
					Validators.nullValidator,
					Validators.maxLength(50),
					Validators.pattern('[a-zA-Zа-яА-Я]+')
				]),
				last_name: new FormControl('', [
					Validators.required,
					Validators.minLength(3),
					Validators.nullValidator,
					Validators.maxLength(50),
					// Validators.pattern('[a-zA-Zа-яА-Я]+')
				]),
				email: new FormControl('', [
					Validators.required,
					Validators.minLength(3),
					Validators.nullValidator,
					Validators.maxLength(50),
					Validators.email,
					Validators.pattern('[a-zA-Zа-яА-Я0-9_@.-]+')
				]),
				password: new FormControl('', [
					Validators.required,
					Validators.minLength(8),
					Validators.nullValidator,
					Validators.maxLength(100),
					Validators.pattern('[a-zA-Zа-яА-Я0-9_@.+!#$%^&*(){}-]+')
				]),
				confirm_password: new FormControl('', [
					Validators.required,
					Validators.minLength(8),
					Validators.nullValidator,
					Validators.maxLength(100),
					Validators.pattern('[a-zA-Zа-яА-Я0-9_@.+!#$%^&*(){}-]+')
				]),
				personal_data: new FormControl('', [
					Validators.requiredTrue
				]),
				advertising: new FormControl(''),
			},
			[CustomValidators.MatchValidator('password', 'confirm_password')]
		);

		this._auth_form = new FormGroup(
			{
				email: new FormControl('', [
					Validators.required,
					Validators.minLength(3),
					Validators.nullValidator,
					Validators.maxLength(50),
					Validators.email
				]),
				password: new FormControl('', [
					Validators.required,
					Validators.minLength(8),
					Validators.nullValidator,
					Validators.maxLength(100)
				])
			}
		);

	}

	public errors_list(field: AbstractControl<any, any> | null, name?: string) {
		if(field && field.errors) {
			return Object.keys(field.errors).map(error => {
				switch (error) {
					case 'required': return 'Заполните поле';
					case 'minlength': return 'Минимальное количество символов: ' + field.errors?.[error]['requiredLength'];
					case 'maxlength': return 'Максимальное количество символов: ' + field.errors?.[error]['requiredLength'];
					case 'email': return 'Некорректный адрес';
					case 'email_busy': return 'Электронный адрес занят';
					case 'invalid_email_or_password': return 'Неверный электронный адрес или пароль'
					case 'pattern': return (() => {
						switch (name) {
							case 'email': return 'Электронный адрес содержит запрещённые символы';
							case 'password': return 'Пароль содержит запрещённые символы';
							case 'confirm_password': return 'Повторный пароль содержит запрещённые символы';
							default: return 'Разрешены только буквы';
						}
					})();
					default: return null;
				}
			})
		}
		return null;
	}

	public validate(name: string): any[] {
		const field = this.form_field(name);
		if(field && field.invalid && (field.dirty || field.touched) && field.errors) {
			const arr = this.errors_list(field, name);

			return (arr && arr.every(el => el) && arr) || [];
		}
		return [];
	}

	public form_field(name: string): AbstractControl<any, any> | null {
		return this._form_type ? this._auth_form.get(name) : this._register_form.get(name);
	}

	public get register_form(): FormGroup {
		return this._register_form;
	}

	public get auth_form(): FormGroup {
		return this._auth_form;
	}

	public get form_type() {
		return this._form_type;
	}

	public switch_form_type(): void {
		this._form_type = !this._form_type;
	}

	public on_submit(): void {

		const form = this.form_type ? this._auth_form : this._register_form;
		const fields = Object.keys(form.controls).map(field => form.controls[field]);
		const fields_valid = fields.map(field => field.valid).every(field => field);
		delete form.value['confirm_password'];

		if(fields_valid) {

			const url = this._form_type ? 'http://localhost:4000/auth' : 'http://localhost:4000/register';

			fetch(url, {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(form.value)
			}).then(res => {
				return res;
			}).then(async res => {
				const data = await res.json();
				if(data.error && url !== 'http://localhost:4000/auth') {
					form.controls['email'].setErrors({'email_busy': true});
					return data;
				}
				if(res.status === 401) {
					form.setErrors({'invalid_email_or_password': true});
					form.setErrors({'email_busy': true});
					return data;
				}
				form.reset();
				return data;
			}).then(console.log).catch(console.error);

			return
		}

		console.error('Fields invalid');

	}

	ngOnInit(): void {
	}

}
