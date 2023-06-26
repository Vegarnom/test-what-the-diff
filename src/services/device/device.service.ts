import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseData } from 'src/common/params/response.data';
import { In, Like, Repository } from 'typeorm';
import { BrandDeviceService } from '../brand-device/brand-device.service';
import { OrganizationService } from '../organization/organization.service';
import { TokenDeviceService } from '../token-device/token-device.service';
import { TypeBrandDeviceService } from '../type-brand-device/type-brand-device.service';
import { TypeDeviceService } from '../type-device/type-device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { deviceIdDto } from './dto/device-id.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';

@Injectable()
export class DeviceService {
  private readonly logger = new Logger(DeviceService.name);

  constructor(
    @InjectRepository(Device)
    private readonly deviceRepo: Repository<Device>,
    private readonly organizationService: OrganizationService,
    private readonly typeBrandDeviceService: TypeBrandDeviceService, // private readonly tokenDeviceService: TokenDeviceService
    private readonly tokenDeviceService: TokenDeviceService,
    private readonly httpService: HttpService,
    private readonly typeDeviceService: TypeDeviceService,
    private readonly brandDeviceService: BrandDeviceService,
  ) {}
  async create(createDeviceDto: CreateDeviceDto): Promise<ResponseData> {
    let resData = new ResponseData();
    const deviceCreate = new Device();
    try {
      this.logger.log(`create device ${JSON.stringify(createDeviceDto)}`);
      resData = await this.findOne(createDeviceDto.deviceId);
      if (!resData.hasError) {
        resData.hasError = true;
        resData.appData = null;
        resData.message =
          '追加のデバイスIDは既に存在していますので、ご確認ください。';
        this.logger.log(`device id ${createDeviceDto.deviceId} is exist`);
        return resData;
      }

      resData = await this.organizationService.findOne(
        createDeviceDto.organizationId,
      );
      if (resData.hasError) {
        return resData;
      }

      const typeBrand =
        await this.typeBrandDeviceService.findOneByTypeIdAndBrandId(
          createDeviceDto.typeId,
          createDeviceDto.brandId,
        );
      if (typeBrand.hasError) {
        resData.message = 'typeBrand Id not exist';
        resData.hasError = true;
        resData.appData = null;
        return resData;
      }

      resData = await this.findOneByName(createDeviceDto.deviceName);
      if (!resData.hasError) {
        resData.hasError = true;
        resData.appData = null;
        resData.message =
          '追加のデバイス名は既に存在していますので、違う名前でご登録ください。';
        return resData;
      }

      resData.hasError = false;
      deviceCreate.deviceId = createDeviceDto.deviceId;
      deviceCreate.organizationId = createDeviceDto.organizationId;
      deviceCreate.deviceName = createDeviceDto.deviceName;
      deviceCreate.typeBrandId = typeBrand.appData[0].id;
      deviceCreate.deviceIp = createDeviceDto.deviceIp;
      deviceCreate.tokenDeviceId = createDeviceDto.tokenDeviceId;
      deviceCreate.isDisable = createDeviceDto.isDisable;
      deviceCreate.note = createDeviceDto.note;
      deviceCreate.isAddBySync = createDeviceDto.isAddBySync;

      const device = await this.deviceRepo.save(deviceCreate);
      this.logger.log(`[SAVE CREATE]: ${JSON.stringify(device)}`);
      resData.appData = device;
      resData.message = 'Create device success';
      // return 'This action adds a new device';
      return resData;
    } catch (error) {
      this.logger.error('[create]: ' + error);
      resData.hasError = true;
      resData.message = ' Something wrong just happened';
    }
  }
  //get list device & nameHotel & nameType API
  async findAll(): Promise<ResponseData> {
    const resData = new ResponseData();

    try {
      const deviceList = await this.deviceRepo.find({
        where: {
          isDeleted: false,
        },
      });
      this.logger.log('[retrieving data]: ' + JSON.stringify(deviceList));

      for (let index = 0; index < deviceList.length; index++) {
        const element = deviceList[index];
        const dataHotel = await this.organizationService.findOne(
          element.organizationId,
        );

        element['nameHotel'] = dataHotel.appData.name;

        const dataTypeBrandDevice = await this.typeBrandDeviceService.findOne(
          element.typeBrandId,
        );

        const dataTypeDevice = await this.typeDeviceService.findOne(
          dataTypeBrandDevice.appData.typeDeviceId,
        );
        element['nameType'] = dataTypeDevice.appData.name;
      }

      resData.appData = deviceList;
      resData.message = 'Get device list success';
      // return `This action returns all device`;
      return resData;
    } catch (error) {
      this.logger.error(`[get all] have an error: ${error} `);
      resData.hasError = true;
      resData.message = 'Something wrong just happened';
      return resData;
    }
  }

  async findAllTypeName(organizationId: number): Promise<ResponseData> {
    const resData = new ResponseData();
    const resListTypeIdByOrgId = new ResponseData();

    resListTypeIdByOrgId.appData = resListTypeIdByOrgId.appData || [];
    resData.appData = resData.appData || [];

    const resFindAll = await this.findAll();
    const appData = resFindAll.appData;
    for (let index = 0; index < appData.length; index++) {
      const element = appData[index];
      if (element.organizationId == organizationId) {
        resListTypeIdByOrgId.appData.push(element);
      }
    }

    for (let index = 0; index < resListTypeIdByOrgId.appData.length; index++) {
      const element = resListTypeIdByOrgId.appData[index];
      const resTypeBrand = await this.typeBrandDeviceService.findOne(
        element.typeBrandId,
      );
      const resType = await this.typeDeviceService.findOne(
        resTypeBrand.appData.typeDeviceId,
      );
      resData.appData.push(resType);
    }
    return resData;
  }

  async findOneByName(deviceName: string): Promise<ResponseData> {
    this.logger.log(`[input data find one device name ${deviceName}]`);
    const resData = new ResponseData();
    const device = await this.deviceRepo.findOne({
      where: {
        isDeleted: false,
        deviceName,
      },
    });

    if (device === null) {
      resData.hasError = true;
      this.logger.log(`not found device ${deviceName}`);
      resData.message = 'Not found device name';
      return resData;
    }

    this.logger.log(`found success ${deviceName}`);
    resData.appData = device;
    resData.message = 'Get device success';
    return resData;
  }

  async findOne(deviceId: string): Promise<ResponseData> {
    this.logger.log('[input data findOne]: ' + JSON.stringify(deviceId));
    const resData = new ResponseData();
    const device = await this.deviceRepo.findOne({
      where: {
        isDeleted: false,
        deviceId,
      },
    });

    if (!device) {
      resData.hasError = true;
      resData.message = 'Not found device id';
      this.logger.log(`type device id ${deviceId} is not exist`);
      return resData;
    }

    resData.appData = device;
    resData.message = 'Get device success';
    this.logger.log(`find type device id ${deviceId} success`);
    // return `This action returns a #${id} device`;
    return resData;
  }

  // update device
  async update({
    deviceId,
    updateDeviceDto,
  }: {
    deviceId: string;
    updateDeviceDto: UpdateDeviceDto;
  }): Promise<ResponseData> {
    this.logger.log(
      '[input data update]: ' +
        JSON.stringify(deviceId) +
        JSON.stringify(updateDeviceDto),
    );
    let resData = new ResponseData();

    resData = await this.findOne(deviceId);

    if (resData.hasError) {
      return resData;
    }

    resData = await this.organizationService.findOne(
      updateDeviceDto.organizationId,
    );

    if (resData.hasError) {
      return resData;
    }

    resData = await this.typeBrandDeviceService.findOne(
      updateDeviceDto.typeBrandId,
    );

    if (resData.hasError) {
      return resData;
    }

    const device = await this.deviceRepo.save(updateDeviceDto);

    resData.appData = device;
    resData.message = 'Update device success';
    // return `This action updates a #${id} device`;
    return resData;
  }

  // remove device
  async remove(deviceId: string): Promise<ResponseData> {
    this.logger.log('[input remove data]: ' + JSON.stringify(deviceId));
    const resData = await this.findOne(deviceId);

    if (resData.hasError) {
      return resData;
    }

    const device = resData.appData;
    device.setIsDelete(true);
    this.deviceRepo.save(device);

    resData.appData = null;
    resData.message = 'Delete device success';
    // return `This action removes a #${id} device`;
    return resData;
  }

  // remove more device
  async removeAll(device: deviceIdDto): Promise<ResponseData> {
    this.logger.log('[input removeAll data]: ' + JSON.stringify(device));
    const resData = new ResponseData();
    const deviceId = device.deviceId;
    try {
      if (deviceId.length === 0) {
        resData.hasError = true;
        resData.message = 'no deviceId, input deviceId';
        return resData;
      }
      for (let index = 0; index < deviceId.length; index++) {
        const element = deviceId[index];
        if (element === null) {
          resData.hasError = true;
          resData.message = 'deviceId null, deviceId must string, delete fail';
          resData.appData = null;
          return resData;
        }
        const device = await this.deviceRepo.findOne({
          where: {
            isDeleted: false,
            deviceId: element,
          },
        });

        if (device === null) {
          resData.hasError = true;
          resData.message = 'Device Id not found, delete fail';
          resData.appData = null;
          return resData;
        }
      }

      for (let index = 0; index < deviceId.length; index++) {
        const element = deviceId[index];
        const device = await this.deviceRepo.findOne({
          where: {
            isDeleted: false,
            deviceId: element,
          },
        });

        device.setIsDelete(true);
        const varSave = await this.deviceRepo.save(device);

        resData.appData = varSave;
      }

      resData.message = 'Delete all device success';
      return resData;
    } catch (error) {
      this.logger.error('[remove all]: ' + JSON.stringify(error));
      resData.hasError = true;
      resData.message = ' Something wrong just happened';
      return resData;
    }
  }

  // search & paging
  async search(
    typeId: number,
    brandId: number,
    indexPage: number,
    deviceId: string,
    deviceName: string,
    isDisable: boolean,
    totalRecordPerPage: number,
  ): Promise<ResponseData> {
    this.logger.log(
      `[input search data]:
      typeId: ${typeId} | brandId: ${brandId} | indexPage: ${indexPage} 
      | deviceId: ${deviceId} | deviceName: ${deviceName} | isDisable: ${isDisable} 
      | totalRecordPerPage: ${totalRecordPerPage}`,
    );
    const resData = new ResponseData();
    const response = {
      indexPage: 0,
      totalPage: 0,
      totalRecord: 0,
      indexStart: 0,
      indexEnd: 0,
      data: [],
    };
    response.data = response.data || [];

    try {
      const resTypeBrand =
        await this.typeBrandDeviceService.findOneByTypeIdAndBrandId(
          typeId,
          brandId,
        );

      const typeBrandId = resTypeBrand.appData.map((item) => Number(item.id));

      response.indexPage = Number(indexPage);
      const params = {
        isDeleted: false,
      };
      if (typeBrandId.length) params['typeBrandId'] = In(typeBrandId);
      if (deviceId) params['deviceId'] = Like(`%${deviceId}%`);
      if (deviceName) params['deviceName'] = Like(`%${deviceName}%`);
      if (isDisable == true || isDisable == false)
        params['isDisable'] = isDisable;

      const resTotalRecord = await this.deviceRepo.find({
        where: params,
        order: { updatedAt: 'DESC' },
      });

      if (resTotalRecord.length === 0) {
        resData.appData = response;
        resData.message = 'No data match';
        return resData;
      }

      response.totalRecord = resTotalRecord.length;

      const resAllTotalRecord = await this.queryNameTypeAndNameHotel(
        resTotalRecord,
      );

      const recordPerPage = Number(totalRecordPerPage);
      const page = resTotalRecord.length / recordPerPage;
      response.totalPage = Math.ceil(page);

      const resPushDataToPage = this.pushDataToPage(
        response.indexPage,
        recordPerPage,
        resAllTotalRecord,
      );
      response.indexStart = resPushDataToPage.indexStart;
      response.indexEnd = resPushDataToPage.indexEnd;
      response.data = resPushDataToPage.data;

      if (response.data.length === 0) {
        resData.hasError = true;
        resData.message = 'this page has no data';
        return resData;
      }

      resData.appData = response;
      resData.message = 'success!';
      return resData;
    } catch (error) {
      this.logger.error('[search data]: ' + error);
      resData.hasError = true;
      resData.message = 'Something wrong happend';
      return resData;
    }
  }
  // add feld nameHotel & nameType to list data
  async queryNameTypeAndNameHotel(resTotalRecord) {
    for (let index = 0; index < resTotalRecord.length; index++) {
      const element = resTotalRecord[index];
      const dataHotel = await this.organizationService.findOne(
        element.organizationId,
      );
      element['nameHotel'] = dataHotel.appData.name;

      const dataTypeBrandDevice = await this.typeBrandDeviceService.findOne(
        element.typeBrandId,
      );
      const dataTypeDevice = await this.typeDeviceService.findOne(
        dataTypeBrandDevice.appData.typeDeviceId,
      );
      element['nameType'] = dataTypeDevice.appData.name;
      const dataBrandDevice = await this.brandDeviceService.findOne(
        dataTypeBrandDevice.appData.brandDeviceId,
      );
      element['nameBrand'] = dataBrandDevice.appData.name;
    }
    return resTotalRecord;
  }
  // return index start & index end, push record to list data by index start, end
  pushDataToPage(indexPage, recordPerPage, resTotalRecord) {
    const response = {
      indexStart: 0,
      indexEnd: 0,
      data: [],
    };
    const indexStart = indexPage * recordPerPage;
    const indexEnd = indexStart + recordPerPage;

    response.indexStart = indexStart + 1;
    response.indexStart = indexStart + 1;
    if (indexEnd > resTotalRecord.length) {
      response.indexEnd = resTotalRecord.length;
    } else {
      response.indexEnd = indexEnd;
    }

    for (let index = indexStart; index < indexEnd; index++) {
      const element = resTotalRecord[index];
      if (element != null) {
        response.data.push(element);
      }
    }
    return response;
  }

  // get list device SWB in app
  async getListSwbInApp(brandId, orgId): Promise<ResponseData> {
    const resData = new ResponseData();
    this.logger.log(`get list device in SWB app by brandId: ${brandId} & orgId: ${orgId}`);
    try {
      // find token in tokenDevice table
      const resToken = await this.tokenDeviceService.findByBrandIdAndOrgId(
        brandId,
        orgId,
      );
      if (resToken.hasError) {
        return resToken;
      }
      // get token&token secret in DB
      let token: '';
      let secret: '';

      for (let index = 0; index < resToken.appData.length; index++) {
        const element = resToken.appData[index];
        if (element.typeToken == 'Token') {
          token = element.valueToken;
        }
        if (element.typeToken == 'Token Secret') {
          secret = element.valueToken;
        }
      }
      this.logger.log(`token: ${token} & token secret: ${secret}`);
      if (!token || !secret ) {
        resData.appData = [];
        resData.hasError = true;
        resData.message = `not found Token and Token secret of brandId: ${brandId}`;
        return resData;
      }
      // create sign
      const t = Date.now();
      const nonce = 'requestID';
      const data = token + t + nonce;
      const { createHmac } = await import('node:crypto');

      const signTerm = createHmac('sha256', secret)
        .update(Buffer.from(data, 'utf-8'))
        .digest();
      const sign = signTerm.toString('base64');
      const url = process.env.SWITCHBOT_URL_GET_LIST_DEVICE;
      // get device
      const reqDevice = await this.httpService.axiosRef.get(url, {
        headers: {
          Authorization: token,
          sign: sign,
          nonce: nonce,
          t: t,
          'Content-Type': 'application/json',
        },
      });

      resData.appData = reqDevice.data.body.deviceList;
      resData.hasError = false;
      return resData;
    } catch (error) {
      this.logger.error(`get device in SWB app have error: ${error}`);
      resData.hasError = true;
      resData.appData = [];
      if(error.response && error.response.status == 401) resData.message = '401';
      else resData.message = `get device in SWB app have error: ${error}`;
      return resData;
    }
  }

  // sync device Switchbot Lock
  async getListDevice(brandId: number, orgId: number): Promise<ResponseData> {
    let createDeviceDto = new CreateDeviceDto();
    const responseData = new ResponseData();
    this.logger.log(`input data brandId: ${brandId}, orgId: ${orgId}`);
    try {
      // get all device
      const resDevice = await this.findAll();
      if (resDevice.hasError) {
        return resDevice;
      }

      // find all typeBrand by brandId and canSync to do get list typeId
      const typeBrand =
        await this.typeBrandDeviceService.findByBrandIdAndCanSync(brandId);
      if (typeBrand.hasError) {
        responseData.message = 'typeBrand record not exist';
        responseData.hasError = true;
        return responseData;
      }

      const typeBrandId = typeBrand.appData.map((item) => Number(item.id));
      const listTypeId = typeBrand.appData.map((item) =>
        Number(item.typeDeviceId),
      );
      // find device add by sync and by typeBrand Id
      const resListDeviceDelete = await this.deviceRepo.find({
        where: {
          isDeleted: false,
          typeBrandId: In(typeBrandId),
          isAddBySync: true,
        },
      });
      // delete all record resListDeviceDelete
      for (let index = 0; index < resListDeviceDelete.length; index++) {
        const element = resListDeviceDelete[index];

        element.setIsDelete(true);
        await this.deviceRepo.save(element);
      }

      // get list device in app SWB
      const reqDevice = await this.getListSwbInApp(brandId, orgId);

      if (reqDevice.hasError) {
        return reqDevice;
      }

      // for list device in SWB server
      for (let index = 0; index < reqDevice.appData.length; index++) {
        const element = reqDevice.appData[index];
        // check deviceId exist in database -> delete
        const resData = await this.findOne(element.deviceId);
        if (!resData.hasError) {
          resData.appData.setIsDelete(true);
          await this.deviceRepo.save(resData.appData);
        }
        // for list typeId can Sync
        for (let index = 0; index < listTypeId.length; index++) {
          // find one record in typeDevice by typeId & check exist typeId
          const resType = await this.typeDeviceService.findOne(
            listTypeId[index],
          );
          if (!resType.hasError) {
            // check deviceType in SWB server === nameType in database
            if (resType.appData.name === element.deviceType) {
              createDeviceDto = new CreateDeviceDto();
              createDeviceDto.deviceId = element.deviceId;
              createDeviceDto.deviceName = element.deviceName;
              createDeviceDto.organizationId = orgId;
              createDeviceDto.isDisable = true;
              createDeviceDto.typeId = listTypeId[index];
              createDeviceDto.brandId = brandId;
              createDeviceDto.isAddBySync = true;
              await this.create(createDeviceDto);
            }
          }
        }
      }

      responseData.hasError = false;
      responseData.message = 'Sync device success';
      return responseData;
    } catch (error) {
      this.logger.error(`Sync list device have error: ${error}`);
      responseData.hasError = true;
      responseData.appData = null;
      responseData.message = 'Something wrong just happend';
      return responseData;
    }
  }
}
