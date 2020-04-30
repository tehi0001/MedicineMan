import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Config} from '../config';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private snackBar: MatSnackBar) { }

  notify(message: string) {
  	this.snackBar.open(message, "OK", {
  		duration: Config.SNACKBAR_TIMEOUT
	})
  }

  serverErrorNotice() {
  	this.notify("An unknown server error occurred");
  }
}
