import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TYPE_DATA } from 'src/common/helper/constant';
import { ResponseData } from 'src/common/params/response.data';
import { Repository } from 'typeorm';
import { CreateResponseParamDto } from './dto/create-response-param.dto';
import { ResponseParam } from './entities/response-param.entity';

@Injectable()
export class ResponseParamService {
  private readonly logger = new Logger(ResponseParamService.name);
  constructor(
    @InjectRepository(ResponseParam)
    private readonly responseParamRepo: Repository<ResponseParam>,
  ) {}

  async createResponseParam(
    createResponseParamDto: CreateResponseParamDto,
    parentId?: number,
  ): Promise<ResponseParam> {
    try {
      this.logger.log(
        `create response param ${JSON.stringify(createResponseParamDto)}`,
      );
      let responseParam = new ResponseParam();
      responseParam.fromResponseParamDto(createResponseParamDto);
      if (parentId) {
        responseParam.parentId = parentId;
      }
      responseParam = await this.responseParamRepo.save(responseParam);
      this.logger.log(`create response param success`);
      return responseParam;
    } catch (error) {
      this.logger.error(`create response param have error: ${error}`);
      return null;
    }
  }

  async createResponseParamList(
    createResponseParamDtoList: CreateResponseParamDto[],
    mappingApiId: number,
    parentId?: number,
  ): Promise<ResponseData> {
    const resData = new ResponseData();
    try {
      this.logger.log(`create response param list`);
      for (let i = 0; i < createResponseParamDtoList.length; i++) {
        createResponseParamDtoList[i].mappingApiId = mappingApiId;
        const responseParam = await this.createResponseParam(
          createResponseParamDtoList[i],
          parentId,
        );
        if (createResponseParamDtoList[i].children) {
          await this.createResponseParamList(
            createResponseParamDtoList[i].children,
            mappingApiId,
            responseParam.id,
          );
        }
      }
      this.logger.log(`create response param list success`);
      return resData;
    } catch (error) {
      this.logger.error(`create response param list have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async findAllByMappingApiId(mappingApiId: number) {
    try {
      this.logger.log(`find all by mapping api id ${mappingApiId}`);
      const responseParams = await this.responseParamRepo.find({
        where: {
          isDeleted: false,
          mappingApiId,
        },
        order: {
          createdAt: 'ASC',
        }
      });

      const responseParamsResponse = [];
      let createResponseParam;
      for (let i = 0; i < responseParams.length; i++) {
        createResponseParam = new CreateResponseParamDto();
        if (responseParams[i].parentId) {
          const responseParam = this.findElementById(
            responseParamsResponse,
            responseParams[i].parentId,
          );
          responseParam.children.push(
            createResponseParam.fromRequestParam(responseParams[i]),
          );
        } else {
          responseParamsResponse.push(
            createResponseParam.fromRequestParam(responseParams[i]),
          );
        }
      }
      // return `This action returns all responseParam`;
      return responseParamsResponse;
    } catch (error) {
      this.logger.error(
        `find all by mapping api id ${mappingApiId} have error: ${error}`,
      );
      return null;
    }
  }

  async removeByMappingApiId(mappingApiId: number) {
    try {
      this.logger.log(`remove by mapping api id ${mappingApiId}`);
      const responseParams = await this.responseParamRepo.find({
        where: {
          isDeleted: false,
          mappingApiId,
        },
      });
      for (let i = 0; i < responseParams.length; i++) {
        responseParams[i].setIsDelete(true);
        await this.responseParamRepo.save(responseParams[i]);
      }
    } catch (error) {
      this.logger.log(
        `remove by mapping api id ${mappingApiId} have error: ${error}`,
      );
    }
  }

  detect(createResponseParamDtoList: CreateResponseParamDto[]): boolean {
    for (let i = 0; i < createResponseParamDtoList.length; i++) {
      if (
        (createResponseParamDtoList[i].paramChange == '' &&
          createResponseParamDtoList[i].paramDefault == '') ||
        (createResponseParamDtoList[i].paramChange == '' &&
          createResponseParamDtoList[i].paramDefault == null) ||
        (createResponseParamDtoList[i].paramChange == null &&
          createResponseParamDtoList[i].paramDefault == '') ||
        (createResponseParamDtoList[i].paramChange == null &&
          createResponseParamDtoList[i].paramDefault == null) ||
        createResponseParamDtoList[i].type.length < 1
      ) {
        return false;
      } else {
        if (!this.detectType(createResponseParamDtoList[i])) {
          return false;
        }
        if (createResponseParamDtoList[i].children) {
          if (!this.detect(createResponseParamDtoList[i].children)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  detectType(responseParam: CreateResponseParamDto): boolean {
    const arr: string[] = responseParam.type.map((element) => {
      return element.toLowerCase();
    });

    if (!this.checkIncluded(TYPE_DATA, arr)) {
      return false;
    }

    if (
      (!this.checkIncluded(arr, ['object']) &&
        responseParam.children.length > 0) ||
      ((!this.checkIncluded(arr, ['array']) && responseParam.type.length > 1) && 
      (!this.checkIncluded(arr, ['response_code']) && responseParam.type.length > 1))

    ) {
      return false;
    }

    responseParam.type = arr;
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
    responseParams: CreateResponseParamDto[],
    id: number,
  ): CreateResponseParamDto {
    for (let i = 0; i < responseParams.length; i++) {
      if (responseParams[i].id == id) {
        return responseParams[i];
      }
      if (responseParams[i].children) {
        const responseParam = this.findElementById(
          responseParams[i].children,
          id,
        );
        if (responseParam) {
          return responseParam;
        }
      }
    }
    return null;
  }
}
