import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseData } from 'src/common/params/response.data';
import { Repository } from 'typeorm';
import { StructureService } from '../structure/structure.service';
import { CreateStructureOrganizationDto } from './dto/create-structure-organization.dto';
import { UpdateStructureOrganizationDto } from './dto/update-structure-organization.dto';
import { StructureOrganization } from './entities/structure-organization.entity';

@Injectable()
export class StructureOrganizationService {
  private readonly logger = new Logger(StructureOrganizationService.name);

  constructor(
    @InjectRepository(StructureOrganization)
    private readonly structureOrganizationRepo: Repository<StructureOrganization>,
    private readonly structureService: StructureService,
  ) {}
  async findOneById(id: number): Promise<ResponseData> {
    this.logger.log('[find one by id]:' + id);
    const resData = new ResponseData();
    const struct = await this.structureOrganizationRepo.findOne({
      where: {
        isDeleted: false,
        id,
      },
    });

    if (struct === null) {
      resData.hasError = true;
      resData.message = 'Not found struct-org id';
      return resData;
    }

    resData.appData = struct;
    resData.message = 'Get struct-org id success';
    return resData;
  }

  async findOneByName(name: string): Promise<ResponseData> {
    this.logger.log('[find one by name]:' + name);
    const resData = new ResponseData();
    const struct = await this.structureOrganizationRepo.findOne({
      where: {
        isDeleted: false,
        name,
      },
    });

    if (struct === null) {
      resData.hasError = true;
      resData.message = 'Not found struct-org name';
      return resData;
    }

    resData.appData = struct;
    resData.message = 'Get struct-org name success';
    return resData;
  }

  async create(
    createStructureOrganizationDto: CreateStructureOrganizationDto,
  ): Promise<ResponseData> {
    this.logger.log(
      '[input create data]: ' + JSON.stringify(createStructureOrganizationDto),
    );
    let resData = new ResponseData();

    resData = await this.structureService.findOneById(
      createStructureOrganizationDto.structure_id,
    );
    if (resData.hasError) {
      resData.appData = null;
      resData.message = 'structure-id not exist';
      return resData;
    }

    const structOrg = await this.structureOrganizationRepo.save(
      createStructureOrganizationDto,
    );
    resData.appData = structOrg;
    resData.message = 'create struct-org success';
    return resData;
  }

  async update(
    updateStructureOrganizationDto: UpdateStructureOrganizationDto,
  ): Promise<ResponseData> {
    this.logger.log(
      '[input update data]: ' + JSON.stringify(updateStructureOrganizationDto),
    );
    let resData = new ResponseData();

    resData = await this.findOneById(updateStructureOrganizationDto.id);
    if (resData.hasError) {
      resData.appData = null;
      resData.message = 'struct-org id not exist';
      return resData;
    }

    const structOrg = await this.structureOrganizationRepo.save(
      updateStructureOrganizationDto,
    );
    resData.appData = structOrg;
    resData.hasError = false;
    resData.message = 'Update struct-org success';
    return resData;
  }

  async remove(id: number): Promise<ResponseData> {
    this.logger.log('[input remove data]: ' + JSON.stringify(id));
    const resData = await this.findOneById(id);
    if (resData.hasError) {
      resData.appData = null;
      resData.message = 'struct-org not exist';
      return resData;
    }

    const structOrg = resData.appData;
    structOrg.setIsDelete(true);
    this.structureOrganizationRepo.save(structOrg);
    resData.appData = null;
    resData.message = 'remove success';
    return resData;
  }

  async findAll(): Promise<ResponseData> {
    const resData = new ResponseData();
    try {
      const structOrgList = await this.structureOrganizationRepo.find({
        where: {
          isDeleted: false,
        },
      });
      this.logger.log('[get list data]: ' + JSON.stringify(structOrgList));
      resData.appData = structOrgList;
      resData.message = 'Get struct-org list success';
      return resData;
    } catch (error) {
      this.logger.log('[error]: ' + JSON.stringify(error));
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Something wrong just happend';
      return resData;
    }
  }
}
