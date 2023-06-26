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
} from '@nestjs/common';
import { TypeBrandDeviceService } from './type-brand-device.service';
import { CreateTypeBrandDeviceDto } from './dto/create-type-brand-device.dto';
import { UpdateTypeBrandDeviceDto } from './dto/update-type-brand-device.dto';
import { Response } from 'express';
import { responseData } from 'src/common/helper/response';
import { UpdateMultiTypeBrandDeviceDto } from './dto/update-multi-type-brand-deivce.dto';
@Controller('type-brand-device')
export class TypeBrandDeviceController {
  constructor(
    private readonly typeBrandDeviceService: TypeBrandDeviceService,
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async create(
    @Body() createTypeBrandDeviceDto: CreateTypeBrandDeviceDto,
    @Res() res: Response,
  ) {
    return responseData(
      res,
      await this.typeBrandDeviceService.create(createTypeBrandDeviceDto),
    );
  }

  @Get()
  async findAll(@Res() res: Response) {
    return responseData(res, await this.typeBrandDeviceService.findAll());
  }

  @Get('type')
  async findAllTypeByBrand(@Res() res: Response) {
    return responseData(res, await this.typeBrandDeviceService.findAllTypeByBrand());
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    return responseData(res, await this.typeBrandDeviceService.findOne(id));
  }

  @Put()
  async updateMultiByBrandId(
    @Body() typeDeviceId: UpdateMultiTypeBrandDeviceDto,
    @Res() res: Response,
  ) {
    return responseData(
      res,
      await this.typeBrandDeviceService.updateMultiByBrandId(typeDeviceId),
    );
  }


  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTypeBrandDeviceDto: UpdateTypeBrandDeviceDto,
    @Res() res: Response,
  ) {
    return responseData(
      res,
      await this.typeBrandDeviceService.update(id, updateTypeBrandDeviceDto),
    );
  }


  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    return responseData(res, await this.typeBrandDeviceService.remove(id));
  }
}
