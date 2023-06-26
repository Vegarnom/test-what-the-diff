import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseData } from 'src/common/params/response.data';
import { Repository } from 'typeorm';
import { MappingApiService } from '../mapping-api/mapping-api.service';
import { ResponseCodeDto } from './dto/response-code.dto';
import { ResponseCode } from './entities/response-code.entity';

@Injectable()
export class ResponseCodeService {
  private readonly logger = new Logger(ResponseCodeService.name);

  constructor(
    @InjectRepository(ResponseCode)
    private readonly responseCodeRepo: Repository<ResponseCode>,
    @Inject(forwardRef(() => MappingApiService))
    private readonly mappingApiService: MappingApiService,
  ) {}

  async findAllMappingApiId(mappingApiId: number): Promise<ResponseData> {
    const resData = new ResponseData();
    try {
      if (mappingApiId === null) {
        resData.message = 'mapping api id invalid';
        resData.hasError = true;
        return resData;
      }

      this.logger.log(`find all by mapping api id ${mappingApiId}`);
      const listResponseCode = await this.responseCodeRepo.find({
        where: {
          isDeleted: false,
          mappingApiId,
        }
      });

      resData.appData = listResponseCode;
      resData.message = 'Get list response code success';
      return resData;
    } catch(error) {
      this.logger.error(`find all have error: ${error}`);
      resData.appData = null;
      resData.message = 'Something error when get';
      resData.hasError = true;
      return resData;
    }
  }

  async update(listResponseCode: ResponseCodeDto[]): Promise<ResponseData> {
    let resData = new ResponseData();
    try {
      this.logger.log('check validate list response code');
      if(!this.checkValidate(listResponseCode)) {
        this.logger.log('list response code not validate');
        resData.message = 'Please check list response code';
        resData.hasError = true;
        return resData;
      }

      this.logger.log(`Update response code for mapping api id ${listResponseCode[0].mappingApiId}`);
      
      this.logger.log('check mapping api id');
      resData = await this.mappingApiService.findOne(listResponseCode[0].mappingApiId);
      if(resData.hasError) {
        return resData;
      }

      const updateResponseCodes = new Array<ResponseCode>();
      let responseCode: ResponseCode;
      for(let i = 0; i < listResponseCode.length; i++) {
        responseCode = new ResponseCode();
        responseCode.fromResponseCodeDto(listResponseCode[i]);
        if (responseCode === null) {
          this.logger.log('change response code dto to response code have error');
          resData.message = 'Please check list response code';
          resData.hasError = true;
          return resData;
        }
        updateResponseCodes.push(responseCode);
      }

      await this.responseCodeRepo.save(updateResponseCodes);
      resData.appData = null;
      resData.message = 'Update list response code success';
      resData.hasError = false;
      return resData;
    } catch (error) {
      this.logger.error(`update have error: ${error}`);
      resData.appData = null;
      resData.message = 'Something error when update';
      resData.hasError = true;
      return resData;
    }
  }

  checkValidate(listResponseCode: ResponseCodeDto[]): boolean {
    if(listResponseCode && listResponseCode.length > 0) {
      for(let i = 0; i < listResponseCode.length; i++) {
        if(listResponseCode[i].codeDefault === null || listResponseCode[i].codeChange === null ||
          listResponseCode[i].codeDefault === '' || listResponseCode[i].codeChange === '' ||
          listResponseCode[i].mappingApiId === null
        ) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
}
