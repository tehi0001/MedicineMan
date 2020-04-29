import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

const SERVER_URL = "https://fhir.monash.edu/hapi-fhir-jpaserver/fhir";

@Injectable({
	providedIn: 'root'
})
export class ServerService {
	constructor(private http: HttpClient) {}

	getPatients(practitionerId: number): Observable<any> {
		return this.http.get(SERVER_URL + "/Encounter?practitioner=" + practitionerId);
	}
}
