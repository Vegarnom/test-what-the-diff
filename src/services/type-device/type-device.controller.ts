import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Res,
  Put,
} from '@nestjs/common';
import { TypeDeviceService } from './type-device.service';
import { CreateTypeDeviceDto } from './dto/create-type-device.dto';
import { UpdateTypeDeviceDto } from './dto/update-type-device.dto';
import { Response } from 'express';
import { responseData } from 'src/common/helper/response';

@Controller('type-device')
export class TypeDeviceController {
  constructor(private readonly typeDeviceService: TypeDeviceService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async create(
    @Body() createTypeDeviceDto: CreateTypeDeviceDto,
    @Res() res: Response,
  ) {
    return responseData(
      res,
      await this.typeDeviceService.create(createTypeDeviceDto),
    );
  }

  @Get()
  async findAll(@Res() res: Response) {
    return responseData(res, await this.typeDeviceService.findAll());
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    return responseData(res, await this.typeDeviceService.findOne(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTypeDeviceDto: UpdateTypeDeviceDto,
    @Res() res: Response,
  ) {
    return responseData(
      res,
      await this.typeDeviceService.update(id, updateTypeDeviceDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    return responseData(res, await this.typeDeviceService.remove(id));
  }
}
