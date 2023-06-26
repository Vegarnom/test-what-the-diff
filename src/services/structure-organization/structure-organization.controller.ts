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
import { CreateStructureOrganizationDto } from './dto/create-structure-organization.dto';
import { StructureOrganizationService } from './structure-organization.service';
import { Response } from 'express';
import { UpdateStructureOrganizationDto } from './dto/update-structure-organization.dto';

@Controller('structure-organization')
export class StructureOrganizationController {
  constructor(
    private readonly structureOrganizationService: StructureOrganizationService,
  ) {}

  @Post()
  async create(
    @Body() createStructureOrganizationDto: CreateStructureOrganizationDto,
    @Res() res: Response,
  ) {
    return responseData(
      res,
      await this.structureOrganizationService.create(
        createStructureOrganizationDto,
      ),
    );
  }

  @Put()
  async update(
    @Body() updateStructureOrganizationDto: UpdateStructureOrganizationDto,
    @Res() res: Response,
  ) {
    return responseData(
      res,
      await this.structureOrganizationService.update(
        updateStructureOrganizationDto,
      ),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    return responseData(
      res,
      await this.structureOrganizationService.remove(id),
    );
  }

  @Get()
  async findAll(@Res() res: Response) {
    return responseData(res, await this.structureOrganizationService.findAll());
  }
}
