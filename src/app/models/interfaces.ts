export interface UserModel { //Practitioner
	id: number;
	identifier: string;
	name: string;
}

export interface PatientModel {
	id: number;
	name: string;
	cholesterol?: number;
	cholesterolUnit?: string;
	effectiveDate?: string;
	lastUpdate?: string;
	isMonitored?: boolean;
	isLoading?: boolean
}

export interface SettingsModel {
	updateInterval: number;
	intervalUnit: "seconds" | "minutes" | "hours";
}

export interface Patient {
	name: string;
	dateOfBirth: string;
	gender: string;
	address: string;
	city: string;
	state: string;
	country: string;
}
