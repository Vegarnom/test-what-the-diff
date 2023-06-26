import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DevicesService } from './devices.service';
import { DevicesDto } from './dto/devices.dto';
import { Request, Response } from 'express';
import { responseCreated, responseOk } from '../../common/helper/response';

@Controller('devices')
export class DevicesController {
  private readonly logger = new Logger(DevicesController.name);

  constructor(private readonly devicesService: DevicesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createDevice(
    @Req() req: Request,
    @Body() devicesDto: DevicesDto,
    @Res() res: Response,
  ) {
    const token = req.headers.authorization.replace('Bearer ', '');
    const result = await this.devicesService.createDevice(devicesDto, token);
    responseCreated(res, result);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateDevice(@Body() devicesDto: DevicesDto, @Res() res: Response) {
    const result = await this.devicesService.updateDevice(devicesDto);
    responseOk(res, result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAllDevicesByUser(@Req() req: Request, @Res() res: Response) {
    const token = req.headers.authorization.replace('Bearer ', '');
    const result = await this.devicesService.getAllDevicesByUser(token);
    responseOk(res, result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAllDevices(@Res() res: Response) {
    const result = await this.devicesService.getAllDevices();
    responseOk(res, result);
  }
}
