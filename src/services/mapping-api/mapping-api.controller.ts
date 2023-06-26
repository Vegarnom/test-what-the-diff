import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { MappingApiService } from './mapping-api.service';
import { CreateMappingApiDto } from './dto/create-mapping-api.dto';
import { UpdateMappingApiDto } from './dto/update-mapping-api.dto';
import { Request, Response } from 'express';
import { responseData } from 'src/common/helper/response';

@Controller('mapping-api')
export class MappingApiController {
  constructor(private readonly mappingApiService: MappingApiService) {}

  @Post()
  async create(
    @Body() createMappingApiDto: CreateMappingApiDto,
    @Res() res: Response,
  ) {
    return responseData(
      res,
      await this.mappingApiService.create(createMappingApiDto),
    );
  }

  @Get('all')
  async getAll(@Res() res: Response) {
    return responseData(res, await this.mappingApiService.getAll());
  }

  @Get()
  async findAll(
    @Query('typeBrandId') typeBrandId: number,
    @Res() res: Response,
  ) {
    if (typeBrandId) {
      return responseData(
        res,
        await this.mappingApiService.findAllByTypeBrandId(typeBrandId),
      );
    }
    return responseData(res, null);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    return responseData(res, await this.mappingApiService.findOne(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMappingApiDto: UpdateMappingApiDto,
    @Res() res: Response,
  ) {
    return responseData(
      res,
      await this.mappingApiService.update(id, updateMappingApiDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    return responseData(res, await this.mappingApiService.remove(id));
  }

  @Get('request/:key/:name')
  async requestGet(
    @Param('key') key: string,
    @Param('name') name: string,
    @Body() body: any,
    @Query() query: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let contentType = 'json';
    if (typeof req.headers['content-type'] === 'string') {
      contentType = req.headers['content-type'].split('/')[1];
    }
    console.log('haha', query);
    const apiKey = req.headers['x-api-key'] || '';
    const response = await this.mappingApiService.request(
      key,
      name,
      'GET',
      contentType,
      body,
      apiKey,
      query,
    );
    if(response && response.catch) {
      return responseData(res, response.data, response.status);
    }
    return responseData(res, response);
  }

  @Post('request/:key/:name')
  async requestPost(
    @Param('key') key: string,
    @Param('name') name: string,
    @Body() body: any,
    @Query() query: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let contentType = 'json';
    if (typeof req.headers['content-type'] === 'string') {
      contentType = req.headers['content-type'].split('/')[1];
    }
    const apiKey = req.headers['x-api-key'] || '';
    console.log('haha', query);
    const response = await this.mappingApiService.request(
      key,
      name,
      'POST',
      contentType,
      body,
      apiKey,
      query,
    );
    if(response && response.catch) {
      return responseData(res, response.data, response.status);
    }
    return responseData(res, response);
  }
}
