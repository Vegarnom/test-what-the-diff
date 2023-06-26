import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseData } from 'src/common/params/response.data';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRespo: Repository<Organization>,
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<ResponseData> {
    let resData = new ResponseData();
    try {
      this.logger.log(
        `creare organization ${JSON.stringify(createOrganizationDto)}`,
      );
      if (createOrganizationDto.id) {
        resData = await this.findOne(createOrganizationDto.id);
        if (!resData.hasError) {
          resData.hasError = true;
          resData.message = 'Id organization is existed';
          this.logger.log(
            `organization id ${createOrganizationDto.id} is exist`,
          );
          resData.appData = null;
          return resData;
        }
      }
      if (createOrganizationDto.parentId) {
        resData = await this.findOne(createOrganizationDto.parentId);
        if (resData.hasError) {
          resData.hasError = true;
          resData.message = 'Not found parent id is existed';
          this.logger.log(
            `parent id ${createOrganizationDto.parentId} not found`,
          );
          resData = null;
          return resData;
        }
      }

      const organization = await this.organizationRespo.save({
        ...createOrganizationDto,
      });
      resData.appData = organization;
      resData.message = 'Create organization success';
      this.logger.log(`create organization success`);

      return resData;
    } catch (error) {
      this.logger.error(`create have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async findAll(): Promise<ResponseData> {
    const resData = new ResponseData();
    try {
      this.logger.log(`find all organization`);
      const organizationList = await this.organizationRespo.find({
        where: {
          isDeleted: false,
        },
      });
      resData.message = 'Get list organization success';
      resData.appData = organizationList;
      this.logger.log(`find all organization success`);
      return resData;
    } catch (error) {
      this.logger.error(`find all have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async findOne(id: number): Promise<ResponseData> {
    const resData = new ResponseData();
    try {
      this.logger.log(`find one by id ${id}`);
      if (id < 1) {
        resData.hasError = true;
        resData.message = 'Organization id is not validate';
        this.logger.log(`organization id ${id} is not validate`);
        return resData;
      }

      const organization = await this.organizationRespo.findOne({
        where: {
          id,
          isDeleted: false,
        },
      });

      if (organization === null) {
        resData.hasError = true;
        resData.message = 'Organization id not found';
        this.logger.log(`organization id ${id} not found`);
        return resData;
      }
      resData.message = 'Get organization success';
      resData.appData = organization;
      this.logger.log(`find one by id ${id} success`);
      return resData;
    } catch (error) {
      this.logger.error(`find one by ${id} have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async update(
    id: number,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<ResponseData> {
    let resData = new ResponseData();
    try {
      this.logger.log(`update by id ${id}`);
      if (updateOrganizationDto.id) {
        resData = await this.findOne(id);
        if (resData.hasError) {
          resData.hasError = true;
          resData.message = 'Id organization not found';
          this.logger.log(
            `organization id ${updateOrganizationDto.id} not found`,
          );
          resData = null;
          return resData;
        }
      }
      if (updateOrganizationDto.parentId) {
        resData = await this.findOne(updateOrganizationDto.parentId);
        if (resData.hasError) {
          resData.hasError = true;
          resData.message = 'Not found parent id is existed';
          this.logger.log(
            `parent id ${updateOrganizationDto.parentId} not found`,
          );
          resData = null;
          return resData;
        }
      }
      const organization = await this.organizationRespo.save({
        ...updateOrganizationDto,
      });
      resData.appData = organization;
      resData.message = 'Update organization success';
      this.logger.log(`update by id ${updateOrganizationDto.id} success`);
      // return `This action updates a #${id} organization`;
      return resData;
    } catch (error) {
      this.logger.error(`update by ${id} have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async remove(id: number): Promise<ResponseData> {
    let resData = new ResponseData();
    try {
      this.logger.log(`remove by id ${id}`);
      resData = await this.findOne(id);
      if (resData.hasError) {
        return resData;
      }
      const organization = resData.appData;
      organization.setIsDelete(true);
      await this.organizationRespo.save(organization);
      resData.message = 'Delete organization success';
      this.logger.log(`remove by id ${id} success`);
      return resData;
    } catch (error) {
      this.logger.error(`remove by ${id} have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }
}
