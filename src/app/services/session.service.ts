import { Injectable } from '@angular/core';
import {UserModel} from '../models/interfaces';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
	private currentUser: UserModel = null;
	constructor(private router: Router) { }

	setCurrentUser(user: any) {
		this.currentUser = user;
		sessionStorage.setItem("currentUser", JSON.stringify(this.currentUser));
	}

	get getCurrentUser(): UserModel {
		if(this.currentUser != null) {
			return  this.currentUser;
		}

		return JSON.parse(sessionStorage.getItem("currentUser"));
	}

	logOut() {
		sessionStorage.clear();
		this.currentUser = null;
		this.router.navigateByUrl("/login");
	}

}
