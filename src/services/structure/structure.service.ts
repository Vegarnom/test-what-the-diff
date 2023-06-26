import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseData } from 'src/common/params/response.data';
import { Repository } from 'typeorm';
import { CreateStructureDto } from './dto/create-structure.dto';
import { UpdateStructureDto } from './dto/update-structure.dto';
import { Structure } from './entities/structure.entity';
import * as crypto from 'crypto';

@Injectable()
export class StructureService {
  private readonly logger = new Logger(StructureService.name);

  constructor(
    @InjectRepository(Structure)
    private readonly structureRepo: Repository<Structure>,
  ) {}
  async findOneById(id: number): Promise<ResponseData> {
    this.logger.log('[find one by id]:' + id);
    const resData = new ResponseData();
    const struct = await this.structureRepo.findOne({
      where: {
        isDeleted: false,
        id,
      },
    });

    if (struct === null) {
      resData.hasError = true;
      resData.message = 'Not found struct id';
      return resData;
    }

    resData.appData = struct;
    resData.message = 'Get struct id success';
    return resData;
  }

  async findOneByName(name: string): Promise<ResponseData> {
    this.logger.log('[find one by name]:' + name);
    const resData = new ResponseData();
    const struct = await this.structureRepo.findOne({
      where: {
        isDeleted: false,
        name,
      },
    });

    if (struct === null) {
      resData.hasError = true;
      resData.message = 'Not found struct name';
      return resData;
    }

    resData.appData = struct;
    resData.message = 'Get struct name success';
    return resData;
  }

  async create(createStructureDto: CreateStructureDto): Promise<ResponseData> {
    this.logger.log(
      '[input create data]: ' + JSON.stringify(createStructureDto),
    );
    let resData = new ResponseData();

    resData = await this.findOneByName(createStructureDto.name);
    if (!resData.hasError) {
      resData.hasError = true;
      resData.appData = null;
      resData.message = 'Structure name is exist';
      return resData;
    }
    const struct = await this.structureRepo.save(createStructureDto);
    resData.appData = struct;
    resData.hasError = false;
    resData.message = 'Create structure success!';
    return resData;
  }

  async update(updateStructure: UpdateStructureDto): Promise<ResponseData> {
    this.logger.log('[input update data]: ' + JSON.stringify(updateStructure));
    let resData = new ResponseData();

    try {
      resData = await this.findOneById(updateStructure.id);
      if (resData.hasError) {
        resData.appData = null;
        resData.message = 'Structure is not exist';
        return resData;
      }

      resData = await this.findOneByName(updateStructure.name);
      if (!resData.hasError && resData.appData.id !== updateStructure.id) {
        resData.appData = null;
        resData.message = 'Name structure is exist';
        return resData;
      }

      const hash = await crypto.createHash('md5').update(updateStructure.apiKey).digest('hex');

      updateStructure.apiKey = hash;

      const struct = await this.structureRepo.save(updateStructure);

      delete struct.apiKey;
      resData.appData = struct;
      resData.hasError = false;
      resData.message = 'update Struct success';
      return resData;
    } catch (error) {
      this.logger.error('[error update]: ' + error);
      resData.hasError = true;
      resData.message = 'update Struct fail';
      return resData;
    }
  }

  async remove(name: string): Promise<ResponseData> {
    this.logger.log('[input remove data]: ' + JSON.stringify(name));

    const resData = await this.findOneByName(name);
    this.logger.log('[input data]: ' + JSON.stringify(resData));
    if (resData.hasError) {
      resData.appData = null;
      resData.message = 'structure not exist';
      return resData;
    }
    const struct = resData.appData;
    struct.setIsDelete(true);
    this.structureRepo.save(struct);
    resData.appData = null;
    resData.message = 'remove success';
    return resData;
  }

  async findAll(): Promise<ResponseData> {
    const resData = new ResponseData();
    try {
      const structList = await this.structureRepo.find({
        where: {
          isDeleted: false,
        },
      });
      this.logger.log('[list struct data]: ' + JSON.stringify(structList));

      resData.appData = structList;
      resData.message = 'Get struct list succes';
      return resData;
    } catch (error) {
      this.logger.error('[error]: ' + JSON.stringify(error));
      resData.hasError = true;
      resData.message = 'Somthing wrong just happend';
      return resData;
    }
  }
}
