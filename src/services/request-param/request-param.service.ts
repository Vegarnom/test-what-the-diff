import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TYPE_DATA } from 'src/common/helper/constant';
import { ResponseData } from 'src/common/params/response.data';
import { Repository } from 'typeorm';
import { CreateRequestParamDto } from './dto/create-request-param.dto';
import { RequestParam } from './entities/request-param.entity';

@Injectable()
export class RequestParamService {
  private readonly logger = new Logger(RequestParamService.name);
  constructor(
    @InjectRepository(RequestParam)
    private readonly requestParamRepo: Repository<RequestParam>,
  ) {}

  async createRequestParam(
    createRequestParamDto: CreateRequestParamDto,
    parentId?: number,
  ): Promise<RequestParam> {
    try {
      this.logger.log(
        `create request param ${JSON.stringify(createRequestParamDto)}`,
      );
      let requestParam = new RequestParam();
      requestParam.fromRequestParamDto(createRequestParamDto);
      if (parentId) {
        requestParam.parentId = parentId;
      }
      requestParam = await this.requestParamRepo.save(requestParam);
      this.logger.log(`create request param success`);
      return requestParam;
    } catch (error) {
      this.logger.error(`create request param have error: ${error}`);
      return null;
    }
  }

  async createRequestParamList(
    createRequestParamDtoList: CreateRequestParamDto[],
    mappingApiId: number,
    parentId?: number,
  ): Promise<ResponseData> {
    const resData = new ResponseData();
    try {
      this.logger.log(`create request param list`);
      for (let i = 0; i < createRequestParamDtoList.length; i++) {
        createRequestParamDtoList[i].mappingApiId = mappingApiId;
        const requestParam = await this.createRequestParam(
          createRequestParamDtoList[i],
          parentId,
        );
        if (createRequestParamDtoList[i].children) {
          await this.createRequestParamList(
            createRequestParamDtoList[i].children,
            mappingApiId,
            requestParam.id,
          );
        }
      }
      this.logger.log(`create request param list success`);
      return resData;
    } catch (error) {
      this.logger.error(`create request param list have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async findAllByMappingApiId(mappingApiId: number) {
    try {
      this.logger.log(`find all by mapping api id ${mappingApiId}`);
      const requestParams = await this.requestParamRepo.find({
        where: {
          isDeleted: false,
          mappingApiId,
        },
        order: {
          createdAt: 'ASC',
        }
      });

      const requestParamsResponse = [];
      let createRequestParam;
      for (let i = 0; i < requestParams.length; i++) {
        createRequestParam = new CreateRequestParamDto();
        if (requestParams[i].parentId) {
          const requestParam = this.findElementById(
            requestParamsResponse,
            requestParams[i].parentId,
          );
          requestParam.children.push(
            createRequestParam.fromRequestParam(requestParams[i]),
          );
        } else {
          requestParamsResponse.push(
            createRequestParam.fromRequestParam(requestParams[i]),
          );
        }
      }
      // return `This action returns all requestParam`;
      return requestParamsResponse;
    } catch (error) {
      this.logger.error(
        `find all by mapping api id ${mappingApiId} have error: ${error}`,
      );
      return null;
    }
  }

  async findOne(id: number): Promise<ResponseData> {
    const resData = new ResponseData();
    try {
      this.logger.log(`find one by id ${id}`);
      const requestParam = await this.requestParamRepo.findOne({
        where: {
          isDeleted: false,
          id,
        },
      });

      if (requestParam === null) {
        resData.hasError = true;
        resData.message = 'Request param id not found';
        this.logger.log(`request param id ${id} not found`);
        return resData;
      }
      // return `This action returns a #${id} requestParam`;
      return resData;
    } catch (error) {
      this.logger.error(`find one by ${id} have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async removeByMappingApiId(mappingApiId: number) {
    try {
      this.logger.log(`remove by mapping api id ${mappingApiId}`);
      const requestParams = await this.requestParamRepo.find({
        where: {
          isDeleted: false,
          mappingApiId,
        },
      });
      for (let i = 0; i < requestParams.length; i++) {
        requestParams[i].setIsDelete(true);
        await this.requestParamRepo.save(requestParams[i]);
      }
    } catch (error) {
      this.logger.log(
        `remove by mapping api id ${mappingApiId} have error: ${error}`,
      );
    }
  }

  detect(createRequestParamDtoList: CreateRequestParamDto[]): boolean {
    for (let i = 0; i < createRequestParamDtoList.length; i++) {
      if (
        (createRequestParamDtoList[i].paramChange === '' &&
          createRequestParamDtoList[i].paramDefault === '') ||
        (createRequestParamDtoList[i].paramChange === '' &&
          createRequestParamDtoList[i].paramDefault === null) ||
        (createRequestParamDtoList[i].paramChange === null &&
          createRequestParamDtoList[i].paramDefault === '') ||
        (createRequestParamDtoList[i].paramChange === null &&
          createRequestParamDtoList[i].paramDefault === null) ||
        createRequestParamDtoList[i].type.length < 1
      ) {
        return false;
      } else {
        if (!this.detectType(createRequestParamDtoList[i])) {
          return false;
        }
        if (createRequestParamDtoList[i].children) {
          if (!this.detect(createRequestParamDtoList[i].children)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  detectType(requestParam: CreateRequestParamDto): boolean {
    const arr: string[] = requestParam.type.map((element) => {
      return element.toLowerCase();
    });

    if (!this.checkIncluded(TYPE_DATA, arr)) {
      return false;
    }

    if (
      (!this.checkIncluded(arr, ['object']) &&
        requestParam.children.length > 0) ||
      (!this.checkIncluded(arr, ['array']) && requestParam.type.length > 1)
    ) {
      return false;
    }

    requestParam.type = arr;
    return true;
  }

  checkIncluded(myArray, checkingArray): boolean {
    if (myArray.length < checkingArray.length) {
      return false;
    }
    let match = true;
    for (let i = 0; i < checkingArray.length; i++) {
      if (!myArray.includes(checkingArray[i])) {
        match = false;
        break;
      }
    }
    return match;
  }

  findElementById(
    requestParams: CreateRequestParamDto[],
    id: number,
  ): CreateRequestParamDto {
    for (let i = 0; i < requestParams.length; i++) {
      if (requestParams[i].id === id) {
        return requestParams[i];
      }
      if (requestParams[i].children) {
        const requestParam = this.findElementById(
          requestParams[i].children,
          id,
        );
        if (requestParam) {
          return requestParam;
        }
      }
    }
    return null;
  }
}
