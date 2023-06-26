import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  Res,
} from '@nestjs/common';

import { Response } from 'express';
import { responseData } from 'src/common/helper/response';
import { ResponseCodeDto } from './dto/response-code.dto';
import { ResponseCodeService } from './response-code.service';

@Controller('response-code')
export class ResponseCodeController {
  constructor(private readonly reponseCodeService: ResponseCodeService) {}

  @Get(':id')
  async getByMappingApiId(
    @Param('id') mappingApiId: number,
    @Res() res: Response,
  ) {
    return responseData(
      res,
      await this.reponseCodeService.findAllMappingApiId(mappingApiId),
    );
  }

  @Put(':id')
  async update(
    @Body() listResponseCode: ResponseCodeDto[],
    @Res() res: Response,
  ) {
    return responseData(
      res,
      await this.reponseCodeService.update(listResponseCode),
    );
  }
}
