import { Controller, Get, Param, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { responseData } from "src/common/helper/response";
import { DeviceHistoryService } from "./device-history.service";
import { DeviceHistorySearchDTO } from "./dto/device-history.dto";

@Controller('device-history')
export class DeviceHistoryController {
	constructor(
		private readonly deviceHistoryService: DeviceHistoryService,
	) {}

	@Get(':deviceId')
	async findAll(
		@Param('deviceId') deviceId: string,
		@Query('page') page: number,
		@Query('pageSize') pageSize: number,
		@Query() deviceHistorySearchDTO: DeviceHistorySearchDTO, 
		@Res() res: Response,
	) {
		console.log(deviceHistorySearchDTO);
		if (deviceId && deviceId !== '') {
			return responseData(
				res,
				await this.deviceHistoryService.findAllByDeviceId(deviceId, deviceHistorySearchDTO, page, pageSize),
			);
		} else {
			return responseData(res, null);
		}
	}
}