import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		MatCardModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatToolbarModule,
		MatTableModule,
		MatIconModule,
		MatSlideToggleModule
	],
	exports: [
		MatCardModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatToolbarModule,
		MatTableModule,
		MatIconModule,
		MatSlideToggleModule
	]
})
export class MaterialModule { }
