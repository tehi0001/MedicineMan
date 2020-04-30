import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {PatientModel} from '../models/interfaces';
import {ServerService} from '../services/server.service';
import {UtilService} from '../services/util.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit, OnChanges {
	tableDataSource: MatTableDataSource<PatientModel>;
	displayedColumns: string[] = ['counter', 'name', 'cholesterol', 'effectiveDate', 'lastUpdate', 'action'];

	@Input() patientToAdd: PatientModel;

	@Output() remove: EventEmitter<PatientModel> = new EventEmitter();

	isRunning: boolean = false;

	isUpdating: boolean = false;

	constructor(
		private server: ServerService,
		private util: UtilService
	) { }

	ngOnInit(): void {
		this.tableDataSource = new MatTableDataSource<PatientModel>([]);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if(this.patientToAdd != null) {
			this.isRunning = false;
			this.isUpdating = false;

			this.addPatient();

			let index = this.tableDataSource.data.length - 1;

			this.getCholesterolData(this.patientToAdd, index).subscribe(() => {
				this.run();
			}, () => {
				this.removePatient(this.patientToAdd, index);
				if(this.tableDataSource.data.length > 0) {
					this.run();
				}
			})
		}
	}
	addPatient() {
		this.tableDataSource.data.push(this.patientToAdd);
		this.tableDataSource._updateChangeSubscription();
	}
	removePatient(patient: PatientModel, index: number) {
		this.tableDataSource.data.splice(index, 1);
		this.tableDataSource._updateChangeSubscription();
		this.remove.emit(patient);
	}

	getCholesterolData(patient: PatientModel, index: number): Observable<any> {
		return new Observable(observer => {
			this.server.getCholesterol(patient.id).subscribe(response => {
				if (response.entry == undefined) {
					this.util.notify("Patient has no cholesterol observations");
					observer.error();
				} else {
					this.tableDataSource.data[index].cholesterol = response.entry[0].resource.valueQuantity.value;
					this.tableDataSource.data[index].cholesterolUnit = response.entry[0].resource.valueQuantity.unit;
					this.tableDataSource.data[index].effectiveDate = response.entry[0].resource.issued
					this.tableDataSource.data[index].lastUpdate = (new Date()).toString();
					this.tableDataSource.data[index].isMonitored = true;
					observer.next();
				}
				patient.isLoading = false;

			});
		})
	}

	run() {
		this.isRunning = true;
		this.isUpdating = true;
		this.tableDataSource.data.forEach((patient, index) => {
			this.getCholesterolData(patient, index).subscribe(() => {
				if(index == this.tableDataSource.data.length - 1) {
					this.tableDataSource._updateChangeSubscription();
					this.isUpdating = false;
					setTimeout(() => {
						this.run();
					}, 5000);
				}
			})
		})
	}
}
