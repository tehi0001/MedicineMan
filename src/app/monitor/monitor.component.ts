import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Patient} from '../models/interfaces';
import {ServerService} from '../services/server.service';
import {UtilService} from '../services/util.service';
import {Observable} from 'rxjs';
import {SessionService} from '../services/session.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit, OnDestroy {
	tableDataSource: MatTableDataSource<Patient>;
	displayedColumns: string[] = ['counter', 'name', 'cholesterol', 'effectiveDate', 'lastUpdate', 'action'];

	@Output() remove: EventEmitter<Patient> = new EventEmitter();

	isRunning: boolean = false;
	isUpdating: boolean = false;
	isInitializing: boolean = false;

	showViewPatient: boolean = false;
	patientIdToView: number;

	constructor(
		private server: ServerService,
		private util: UtilService,
		private session: SessionService
	) { }

	ngOnInit(): void {
		this.tableDataSource = new MatTableDataSource<Patient>([]);
	}

	addPatient(patient: Patient): boolean {
		this.showViewPatient = false;
		if(patient == null || this.isUpdating || this.isInitializing) {
			this.util.notify("System is busy. Try again shortly.");
			return false;
		}

		this.tableDataSource.data.push(patient);
		this.tableDataSource._updateChangeSubscription();

		let index = this.tableDataSource.data.length - 1;
		this.isInitializing = true;
		this.getCholesterolData(patient, index).subscribe(() => {
			this.isInitializing = false;
			if(!this.isRunning) {
				this.run();
			}
		}, () => {
			this.isInitializing = false;
			this.removePatient(patient, index);
		});

		return true;
	}
	removePatient(patient: Patient, index: number) {
		this.tableDataSource.data.splice(index, 1);
		this.tableDataSource._updateChangeSubscription();

		if(this.tableDataSource.data.length == 0) {
			this.isRunning = false;
		}
		this.remove.emit(patient);
	}

	getCholesterolData(patient: Patient, index: number): Observable<any> {
		return new Observable(observer => {
			this.server.getCholesterol(patient.id).subscribe(response => {
				if (response.entry == undefined) {
					this.util.notify("ERROR: No cholesterol observations for " + patient.name);
					observer.error();
				} else {
					this.tableDataSource.data[index].cholesterol = response.entry[0].resource.valueQuantity.value;
					this.tableDataSource.data[index].cholesterolUnit = response.entry[0].resource.valueQuantity.unit;
					this.tableDataSource.data[index].effectiveDate = response.entry[0].resource.issued
					this.tableDataSource.data[index].lastUpdate = (new Date()).toString();
					this.tableDataSource.data[index].isMonitored = true;
					this.tableDataSource.data[index].isLoading = false;

					if(this.tableDataSource.data[index].cholesterol > this.util.getAverageCholesterol(this.tableDataSource.data)) {
						this.tableDataSource.data[index].cholesterolLevel = 'high';
					}

					observer.next();
				}
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
						if(this.isRunning) {
							this.run();
						}
					}, this.session.updateInterval);
				}
			})
		})
	}

	ngOnDestroy(): void {
		this.isRunning = false;
	}

	viewPatient(patient: Patient) {
		this.patientIdToView = patient.id;
		this.showViewPatient = true;
	}
}
