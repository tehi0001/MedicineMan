import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	isBusy: boolean = false;

	loginForm: FormGroup;

	constructor() { }

	ngOnInit(): void {
		this.loginForm = new FormGroup({
			id: new FormControl('', [Validators.required])
		});
	}
}
