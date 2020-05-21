export interface Practitioner { //Practitioner
	id: number;
	identifier: string;
	name: string;
}

export interface Patient {
	id: number;
	name: string;
	cholesterol?: number;
	cholesterolUnit?: string;
	effectiveDate?: string;
	cholesterolLevel?: "high" | "normal" | "low";
	lastUpdate?: string;
	isMonitored?: boolean;
	isLoading?: boolean
}

export interface SettingsModel {
	updateInterval: number;
	intervalUnit: "seconds" | "minutes" | "hours";
}

export interface MonitoredPatient {
	name: string;
	dateOfBirth: string;
	gender: string;
	address: string;
	city: string;
	state: string;
	country: string;
}
