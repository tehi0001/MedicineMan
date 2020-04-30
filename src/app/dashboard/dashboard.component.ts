import {Component, OnInit, ViewChild} from '@angular/core';
import {UtilService} from '../services/util.service';
import {ServerService} from '../services/server.service';
import {Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {SessionService} from '../services/session.service';
import {PatientModel, UserModel} from '../models/interfaces';
import {MonitorComponent} from '../monitor/monitor.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	practitioner: UserModel;

	isLoading: boolean = false;

	tableDataSource: MatTableDataSource<PatientModel>;

	displayedColumns = ['counter', 'name', 'action'];

	patientToAdd: PatientModel = null;

	constructor(
		private utilService: UtilService,
		private server: ServerService,
		private session: SessionService,
		private router: Router
	) { }

	ngOnInit(): void {
		this.practitioner = this.session.getCurrentUser;

		if(this.practitioner == null) {
			this.router.navigateByUrl("/");
		}
		else {
			this.loadPatients();
		}
	}

	loadPatients() {
		this.isLoading = true;
		this.server.getPatients(this.practitioner.identifier).subscribe(response => {
			let patients: PatientModel[] = []; // To hold all returned patients including duplicates
			response.entry.forEach(entry => {
				let id = entry.resource.subject.reference.replace("Patient/", "");
				let name = entry.resource.subject.display;
				let patient: PatientModel = {
					id: id,
					name: name,
					isLoading: true
				};

				patients.push(patient);
			});

			//Remove duplicates and populate table
			this.tableDataSource = new MatTableDataSource<PatientModel>(this.getUniquePatientsFromEncounters(patients))

			this.isLoading = false;

			/*setTimeout(()=> {
				this.updateCholesterolData();
			}, 5000);*/
		})
	}

	getUniquePatientsFromEncounters(patients: PatientModel[]): PatientModel[] {
		let uniquePatientsSet: Set<string> = new Set<string>();

		patients.forEach(patient => {
			uniquePatientsSet.add(JSON.stringify(patient));
		});

		let uniquePatientsArray: PatientModel[] = [];

		uniquePatientsSet.forEach(patient => {
			uniquePatientsArray.push(JSON.parse(patient));
		});

		return  uniquePatientsArray;
	}

	monitorPatient(patient: PatientModel) {
		this.tableDataSource.data[this.getPatientIndex(patient)].isMonitored = true;
		this.tableDataSource.data[this.getPatientIndex(patient)].isLoading = true;
		this.patientToAdd = this.tableDataSource.data[this.getPatientIndex(patient)];
		this.tableDataSource._updateChangeSubscription();
	}

	unmonitorPatient(patient: PatientModel) {
		this.tableDataSource.data[this.getPatientIndex(patient)].isMonitored = false;
		this.tableDataSource._updateChangeSubscription();
		this.patientToAdd = null;
	}

	getPatientIndex(patient: PatientModel): number {
		for(let i = 0; i < this.tableDataSource.data.length; i++) {
			if(this.tableDataSource.data[i].id == patient.id) {
				return i;
			}
		}
	}
}
