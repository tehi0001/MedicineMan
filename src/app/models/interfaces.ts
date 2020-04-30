export interface UserModel {
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
