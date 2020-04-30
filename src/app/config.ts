import {HttpHeaders} from '@angular/common/http';

export class Config {
	static SERVER_URL = "https://fhir.monash.edu/hapi-fhir-jpaserver/fhir";

	static HTTP_CONFIG: object = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			'Cache-Control': 'no-store',
		})
	};

	static SNACKBAR_TIMEOUT = 3000;
}
