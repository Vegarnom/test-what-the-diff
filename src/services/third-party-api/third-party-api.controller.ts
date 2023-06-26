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
  Query,
  Put,
} from '@nestjs/common';
import { ThirdPartyApiService } from './third-party-api.service';
import { CreateThirdPartyApiDto } from './dto/create-third-party-api.dto';
import { UpdateThirdPartyApiDto } from './dto/update-third-party-api.dto';
import { Response } from 'express';
import { responseData } from 'src/common/helper/response';

@Controller('third-party-api')
export class ThirdPartyApiController {
  constructor(private readonly thirdPartyApiService: ThirdPartyApiService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async create(
    @Body() createThirdPartyApiDto: CreateThirdPartyApiDto,
    @Res() res: Response,
  ) {
    return responseData(
      res,
      await this.thirdPartyApiService.create(createThirdPartyApiDto),
    );
  }

  @Get()
  async findAllByThirdPartyId(
    @Res() res: Response,
    @Query('thirdPartyId') thirdPartyId: number,
  ) {
    return responseData(
      res,
      await this.thirdPartyApiService.findAllByThirdPartyId(thirdPartyId),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    return responseData(res, await this.thirdPartyApiService.findOne(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateThirdPartyApiDto: UpdateThirdPartyApiDto,
    @Res() res: Response,
  ) {
    return responseData(
      res,
      await this.thirdPartyApiService.update(id, updateThirdPartyApiDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    return responseData(res, await this.thirdPartyApiService.remove(id));
  }
}
