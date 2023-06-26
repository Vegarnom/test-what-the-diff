import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  Res,
  Put,
  Query,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Response } from 'express';
import { responseData } from 'src/common/helper/response';
import { deviceIdDto } from './dto/device-id.dto';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async create(@Body() createDeviceDto: CreateDeviceDto, @Res() res: Response) {
    return responseData(res, await this.deviceService.create(createDeviceDto));
  }

  // get all
  @Get()
  async findAll(@Res() res: Response) {
    return responseData(res, await this.deviceService.findAll());
  }

  @Get('type/:organizationId')
  async findAllType(
    @Param('organizationId') organizationId: number,
    @Res() res: Response,
  ) {
    return responseData(
      res,
      await this.deviceService.findAllTypeName(organizationId),
    );
  }

  //search & panizated
  @Get('search')
  async searchAndPaginated(
    @Res() res: Response,
    @Query('typeId') typeId: number,
    @Query('brandId') brandId: number,
    @Query('indexPage') indexPage: number,
    @Query('deviceId') deviceId: string,
    @Query('deviceName') deviceName: string,
    @Query('isDisable') isDisable: boolean,
    @Query('totalRecordPerPage') totalRecordPerPage: number,
  ) {
    return responseData(
      res,
      await this.deviceService.search(
        typeId,
        brandId,
        indexPage,
        deviceId,
        deviceName,
        isDisable,
        totalRecordPerPage,
      ),
    );
  }

  @Get(':deviceId')
  async findOne(@Param('deviceId') deviceId: string, @Res() res: Response) {
    return responseData(res, await this.deviceService.findOne(deviceId));
  }

  // update
  @Put(':deviceId')
  async update(
    @Param('deviceId') deviceId: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
    @Res() res: Response,
  ) {
    return responseData(
      res,
      await this.deviceService.update({ deviceId, updateDeviceDto }),
    );
  }

  // delete one
  @Delete(':deviceId')
  async remove(@Param('deviceId') deviceId: string, @Res() res: Response) {
    return responseData(res, await this.deviceService.remove(deviceId));
  }

  @Get('sync/listDevice')
  async getListDevice(
    @Res() res: Response,
    @Query('brandId') brandId: number,
    @Query('orgId') orgId: number,
  ) {
    return responseData(
      res,
      await this.deviceService.getListDevice(brandId, orgId),
    );
  }

  //delete all
  @Delete()
  async removeAll(@Body() deviceId: deviceIdDto, @Res() res: Response) {
    return responseData(res, await this.deviceService.removeAll(deviceId));
  }
}
