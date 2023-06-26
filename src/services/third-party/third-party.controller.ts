import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  Res,
  Put,
} from '@nestjs/common';
import { ThirdPartyService } from './third-party.service';
import { CreateThirdPartyDto } from './dto/create-third-party.dto';
import { UpdateThirdPartyDto } from './dto/update-third-party.dto';
import { Response } from 'express';
import { responseData } from 'src/common/helper/response';
@Controller('third-party')
export class ThirdPartyController {
  constructor(private readonly thirdPartyService: ThirdPartyService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async create(
    @Body() createThirdPartyDto: CreateThirdPartyDto,
    @Res() res: Response,
  ) {
    return responseData(
      res,
      await this.thirdPartyService.create(createThirdPartyDto),
    );
  }

  @Get()
  async findAll(@Res() res: Response) {
    return responseData(res, await this.thirdPartyService.findAll());
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    return responseData(res, await this.thirdPartyService.findOne(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateThirdPartyDto: UpdateThirdPartyDto,
    @Res() res: Response,
  ) {
    return responseData(
      res,
      await this.thirdPartyService.update(id, updateThirdPartyDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    return responseData(res, await this.thirdPartyService.remove(id));
  }
}
