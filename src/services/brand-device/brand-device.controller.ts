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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BrandDeviceService } from './brand-device.service';
import { CreateBrandDeviceDto } from './dto/create-brand-device.dto';
import { UpdateBrandDeviceDto } from './dto/update-brand-device.dto';
import { Response } from 'express';
import { responseData } from 'src/common/helper/response';
import { FileInterceptor } from '@nestjs/platform-express';
import { FormDataRequest } from 'nestjs-form-data';
@Controller('brand-device')
export class BrandDeviceController {
  constructor(private readonly brandDeviceService: BrandDeviceService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  @FormDataRequest()
  async create(
    @Body() createBrandDeviceDto: CreateBrandDeviceDto,
    @Res() res: Response,
  ) {
    // createBrandDeviceDto.file = createBrandDeviceDto.file || null;

    return responseData(
      res,
      await this.brandDeviceService.create(createBrandDeviceDto),
    );
  }

  // test upload image to s3
  @Post('image')
  async uploadPublicFile(
    @UploadedFile() file,
    @Res() res: Response,
  ) {
    const {
      buffer = [],
      originalname = ''
    } = file || {}
    return responseData(
      res,
      await this.brandDeviceService.uploadImage(buffer, originalname),
    );
  }

  @Get()
  async findAll(@Res() res: Response) {
    return responseData(res, await this.brandDeviceService.findAll());
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    return responseData(res, await this.brandDeviceService.findOne(id));
  }

  @Put(':id')
  @FormDataRequest()
  async update(
    @Param('id') id: number,
    @Body() updateBrandDeviceDto: UpdateBrandDeviceDto,
    @Res() res: Response,
  ) {
    console.log("🚀 ~ file: brand-device.controller.ts:74 ~ BrandDeviceController ~ updateBrandDeviceDto:", updateBrandDeviceDto)
    return responseData(
      res,
      await this.brandDeviceService.update(id, updateBrandDeviceDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    return responseData(res, await this.brandDeviceService.remove(id));
  }
}
