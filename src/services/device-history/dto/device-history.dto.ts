export class DeviceHistoryDTO {
	id: number;
	deviceId: string;
	user: string;
	status: string;
	statusDisplay: boolean;
	result: boolean;
	description: string;
}

export class DeviceHistorySearchDTO {
	user: string = '';
	status: string = '';
	result: boolean = null;
	date: Date | string = '';
	description: string = '';
}