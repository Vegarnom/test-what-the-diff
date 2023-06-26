import { Body, Controller, Get, Post, Put, Res } from '@nestjs/common';
import { responseData } from 'src/common/helper/response';
import { CreateTokenDeviceDto } from './dto/create-token-device.dto';
import { TokenDeviceService } from './token-device.service';
import { Response } from 'express';
import { UpdateTokenDeviceDto } from './dto/update-token-device.dto';

@Controller('token-device')
export class TokenDeviceController {
  constructor(private readonly tokenDeviceService: TokenDeviceService) {}

  @Post()
  async create(
    @Body() createTokenDeviceDto: CreateTokenDeviceDto,
    @Res() res: Response,
  ) {
    return responseData(
      res,
      await this.tokenDeviceService.create(createTokenDeviceDto),
    );
  }

  @Put()
  async update(@Body() updateTokenDeviceDto: UpdateTokenDeviceDto, @Res() res: Response) {
    return responseData(res, await this.tokenDeviceService.update(updateTokenDeviceDto));
  }

  @Get()
  async findAll(@Res() res: Response) {
    return responseData(res, await this.tokenDeviceService.findAll());
  }
}
