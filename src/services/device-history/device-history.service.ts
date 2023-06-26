import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ResponseData } from "src/common/params/response.data";
import { Repository, Raw } from "typeorm";
import { DeviceService } from "../device/device.service";
import { OrganizationService } from "../organization/organization.service";
import { TypeBrandDeviceService } from "../type-brand-device/type-brand-device.service";
import { TypeDeviceService } from "../type-device/type-device.service";
import { DeviceHistoryDTO, DeviceHistorySearchDTO } from "./dto/device-history.dto";
import { DeviceHistory } from "./entities/device-history.entity";

@Injectable()
export class DeviceHistoryService {
  private readonly logger = new Logger(DeviceHistoryService.name);
  constructor(
    @InjectRepository(DeviceHistory)
		private readonly deviceHistoryRepo: Repository<DeviceHistory>,
		private readonly deviceService: DeviceService,
		private readonly organization: OrganizationService,
		private readonly typeBrandDeviceService: TypeBrandDeviceService,
		private readonly typeDeviceService: TypeDeviceService,
  ) {}

	async create(deviceHistoryDto: DeviceHistoryDTO): Promise<ResponseData> {
		this.logger.log(`Create device history ${JSON.stringify(deviceHistoryDto)}`);
		let resData = new ResponseData();
		//try handle code
		try {
			this.logger.log(`Check device id: ${deviceHistoryDto.deviceId}`);
			resData = await this.deviceService.findOne(deviceHistoryDto.deviceId);
			//if not found device id => hasError = true
			if (resData.hasError) {
				return resData;
			}
			//else add device history in database
			const deviceHistory = await this.deviceHistoryRepo.save(deviceHistoryDto);

			//set response
			resData.appData = deviceHistory;
			resData.message = "Add device history success";
			return resData;
			//when handle code error 
		} catch (error) {
			this.logger.error(
				`add device history for device id ${deviceHistoryDto.deviceId} has error: ${error}`,
			);
			resData.appData = null;
			resData.message = "Has error when handle.";
			resData.hasError = true;
			return resData;
		}
	}

	async findAllByDeviceId(
		deviceId: string, 
		deviceHistorySearchDto: DeviceHistorySearchDTO, 
		page: number,
		pageSize: number
	): Promise<ResponseData> {
		this.logger.log(`find all by device id ${deviceId}`);
		let resData = new ResponseData();
		//try handle code
		try {
			//check have device id
			let result = {};
			if (deviceId && deviceId !== '') {
				if (page === undefined || page === null || page < 1) {
					page = 1;
				}
				if (pageSize === undefined || pageSize === null || pageSize < 1) {
					pageSize = 10;
				}

				//get device
				resData = await this.deviceService.findOne(deviceId);
				const device = resData.appData;

				//not have device set result to response
				if(device === null) {
					result = {
						nameOrganization: "",
						nameType: "",
						nameDevice: "",
						history: [],
						totalPage: 0, 
					}
				} else {
					const condition = {
						deviceId,
						user: Raw((alias) => `LOWER(${alias}) LIKE '%${deviceHistorySearchDto.user.toLowerCase()}%'`),
						status: Raw((alias) => `LOWER(${alias}) LIKE '${deviceHistorySearchDto.status.toLowerCase()}%'`),
						result: deviceHistorySearchDto.result ? deviceHistorySearchDto.result :
									Raw((alias) => `CAST(${alias} as VARCHAR) LIKE '%%'`),
						date: Raw((alias) => `CAST(${alias} as VARCHAR) LIKE '%${deviceHistorySearchDto.date}%'`),
						description: deviceHistorySearchDto.description === '' ?
										Raw((alias) => `(${alias} LIKE '%%' OR ${alias} IS NULL)`) : 
										Raw((alias) => `LOWER(${alias}) LIKE '%${deviceHistorySearchDto.description.toLowerCase()}%'`),
						isDeleted: false,
					};

					const deviceHistoryList = await this.deviceHistoryRepo.find({
						where: condition,
						order: {
							date: 'DESC',
						},
						skip: (page - 1) * pageSize,
						take: pageSize
					});

					const totalRecord = await this.deviceHistoryRepo.count({
						where: condition
					});

					//get type brand
					resData = await this.typeBrandDeviceService.findOne(device.typeBrandId);
					const typeBrandDevice = resData.appData;

					//get type
					resData = await this.typeDeviceService.findOne(typeBrandDevice.typeDeviceId);
					const typeDevice = resData.appData;

					//get organization
					resData = await this.organization.findOne(device.organizationId);
					const organization = resData.appData;

					//set data to return
					result = {
						nameOrganization: organization.name,
						nameType: typeDevice.name,
						nameDevice: device.deviceName,
						history: deviceHistoryList,
						totalPage: Math.ceil(totalRecord / pageSize),
						totalRecord,
					}
				}
				//set response data
				resData.appData = result;
				resData.message = 'Find all device history by device id success';

				//not have device id set hasError = true
			} else {
				resData.appData = null;
				resData.hasError = true;
				resData.message = "Please input device id valid";
			}
			return resData;
			//when handle code error
		} catch (error) {
			this.logger.error(
				`find all device history by device id ${deviceId} has error: ${error}`,
			);
			resData.appData = null;
			resData.message = "Has error when handle.";
			resData.hasError = true;
			return resData;
		}
	}
}