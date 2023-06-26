import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { responseData } from 'src/common/helper/response';
import { CreateStructureDto } from './dto/create-structure.dto';
import { StructureService } from './structure.service';
import { Response } from 'express';
import { UpdateStructureDto } from './dto/update-structure.dto';

@Controller('structure')
export class StructureController {
  constructor(private readonly structureService: StructureService) {}

  @Post()
  async create(
    @Body() createStructureDto: CreateStructureDto,
    @Res() res: Response,
  ) {
    return responseData(
      res,
      await this.structureService.create(createStructureDto),
    );
  }

  @Put()
  async update(@Body() updateStrdto: UpdateStructureDto, @Res() res: Response) {
    return responseData(res, await this.structureService.update(updateStrdto));
  }

  @Delete(':name')
  async remove(@Param('name') name: string, @Res() res: Response) {
    return responseData(res, await this.structureService.remove(name));
  }

  @Get()
  async findAll(@Res() res: Response) {
    return responseData(res, await this.structureService.findAll());
  }
}
