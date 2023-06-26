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
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Response } from 'express';
import { responseData } from 'src/common/helper/response';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @Res() res: Response,
  ) {
    return responseData(
      res,
      await this.organizationService.create(createOrganizationDto),
    );
  }

  @Get()
  async findAll(@Res() res: Response) {
    return responseData(res, await this.organizationService.findAll());
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    return responseData(res, await this.organizationService.findOne(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
    @Res() res: Response,
  ) {
    return responseData(
      res,
      await this.organizationService.update(id, updateOrganizationDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    return responseData(res, await this.organizationService.remove(id));
  }
}
