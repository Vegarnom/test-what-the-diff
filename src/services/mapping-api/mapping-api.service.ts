import { forwardRef, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TYPE_DATA_FUNCTION } from 'src/common/helper/constant';
import { ResponseData } from 'src/common/params/response.data';
import { Repository } from 'typeorm';
import { AuthorizationKioskService } from '../authorization-kiosk/authorization.service';
import { RequestHttpService } from '../request-http/request-http.service';
import { CreateRequestParamDto } from '../request-param/dto/create-request-param.dto';
import { RequestParamService } from '../request-param/request-param.service';
import { ResponseCode } from '../response-code/entities/response-code.entity';
import { ResponseCodeService } from '../response-code/response-code.service';
import { CreateResponseParamDto } from '../response-param/dto/create-response-param.dto';
import { ResponseParamService } from '../response-param/response-param.service';
import { ThirdPartyApiService } from '../third-party-api/third-party-api.service';
import { TypeBrandDeviceService } from '../type-brand-device/type-brand-device.service';
import { CreateMappingApiDto } from './dto/create-mapping-api.dto';
import { UpdateMappingApiDto } from './dto/update-mapping-api.dto';
import { MappingApi } from './entities/mapping-api.entity';
import { TypeDeviceService } from '../type-device/type-device.service';
import { BrandDeviceService } from '../brand-device/brand-device.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const xml2js = require('xml2js');

@Injectable()
export class MappingApiService {
  private readonly logger = new Logger(MappingApiService.name);

  constructor(
    @InjectRepository(MappingApi)
    private readonly mappingApiRepo: Repository<MappingApi>,
    private readonly requestParamService: RequestParamService,
    private readonly responseParamService: ResponseParamService,
    @Inject(forwardRef(() => ThirdPartyApiService))
    private readonly thirdPartyApiService: ThirdPartyApiService,
    @Inject(forwardRef(() => TypeBrandDeviceService))
    private readonly typeBrandDeviceService: TypeBrandDeviceService,
    private readonly httpService: RequestHttpService,
    @Inject(forwardRef(() => ResponseCodeService))
    private readonly responseCodeService: ResponseCodeService,
    private readonly authorizationKioskService: AuthorizationKioskService,
    @Inject(forwardRef(() => TypeDeviceService))
    private readonly typeDeviceService: TypeDeviceService,
    private readonly brandDeviceService: BrandDeviceService,
  ) {}

  async create(
    createMappingApiDto: CreateMappingApiDto,
  ): Promise<ResponseData> {
    let resData = new ResponseData();
    try {
      this.logger.log(
        `create mapping api ${JSON.stringify(createMappingApiDto)}`,
      );
      //check have third party id
      resData = await this.thirdPartyApiService.findOne(
        createMappingApiDto.thirdPartyApiId,
      );
      if (resData.hasError) {
        return resData;
      }

      //check have type brand id
      resData = await this.typeBrandDeviceService.findOne(
        createMappingApiDto.typeBrandId,
      );
      if (resData.hasError) {
        return resData;
      }

      //check request and response param
      resData = this.checkRequestAndResponseParams(
        createMappingApiDto.requestParams,
        createMappingApiDto.responseParams,
      );
      if (resData.hasError) {
        this.logger.log(`${resData.message}`);
        return resData;
      }

      //create mapping api
      let mappingApi = new MappingApi();
      mappingApi.fromCreateMappingApiDto(createMappingApiDto);
      mappingApi = await this.mappingApiRepo.save(mappingApi);

      await this.requestParamService.createRequestParamList(
        createMappingApiDto.requestParams,
        mappingApi.id,
      );
      await this.responseParamService.createResponseParamList(
        createMappingApiDto.responseParams,
        mappingApi.id,
      );

      resData.message = 'Create mapping api success';
      this.logger.log(`create mapping api success`);
      resData.appData = mappingApi;
      // return 'This action adds a new mappingApi';
      return resData;
    } catch (error) {
      this.logger.error(`create have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async findAllByTypeBrandId(typeBrandId: number): Promise<ResponseData> {
    let resData = new ResponseData();
    try {
      this.logger.log(`find all mapping api`);
      
      // get all mapping api by type brand id
      const mappingApis = await this.mappingApiRepo.find({
        where: {
          isDeleted: false,
          typeBrandId,
        },
      });

      resData = await this.typeBrandDeviceService.findOne(typeBrandId);
			const typeBrandDevice = resData.appData;

      resData = await this.typeDeviceService.findOne(typeBrandDevice.typeDeviceId);
			const typeDevice = resData.appData;

      resData = await this.brandDeviceService.findOne(typeBrandDevice.brandDeviceId);
      const brandDevice = resData.appData;

      const response = {
        typeName: typeDevice.name,
        brandName: brandDevice.name,
        mappingApis
      }

      resData.appData = response;
      resData.message = 'Get mapping api list success';
      this.logger.log(`find all mapping api success`);
      // return `This action returns all mappingApi`;
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
        resData.message = 'Mapping api id is not validate';
        this.logger.log(`mapping api id ${id} is not validate`);
        return resData;
      }

      const mappingApi = await this.mappingApiRepo.findOne({
        where: {
          isDeleted: false,
          id,
        },
      });

      if (mappingApi === null) {
        resData.hasError = true;
        resData.message = 'Mapping api id not found';
        this.logger.log(`mapping api id ${id} not found`);
        return resData;
      }

      mappingApi['requestParams'] =
        await this.requestParamService.findAllByMappingApiId(id);
      mappingApi['responseParams'] =
        await this.responseParamService.findAllByMappingApiId(id);
      resData.appData = mappingApi;
      resData.message = 'Get mapping api success';
      this.logger.log(`find one by id ${id} success`);
      return resData;
    } catch (error) {
      this.logger.error(`find one by id ${id} have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async update(id: number, updateMappingApiDto: UpdateMappingApiDto) {
    let resData = new ResponseData();
    try {
      this.logger.log(`update by id ${id}`);
      //check have third party id
      resData = await this.thirdPartyApiService.findOne(
        updateMappingApiDto.thirdPartyApiId,
      );
      if (resData.hasError) {
        return resData;
      }

      //check have type brand id
      resData = await this.typeBrandDeviceService.findOne(
        updateMappingApiDto.typeBrandId,
      );
      if (resData.hasError) {
        return resData;
      }

      //check request response param
      resData = this.checkRequestAndResponseParams(
        updateMappingApiDto.requestParams,
        updateMappingApiDto.responseParams,
      );
      if (resData.hasError) {
        this.logger.log(`${resData.message}`);
        return resData;
      }

      //update mapping api
      const mappingApi = await this.mappingApiRepo.findOne({
        where: {
          isDeleted: false,
          id,
        },
      });

      if (mappingApi === null) {
        resData.hasError = true;
        resData.message = 'Mapping api id not found';
        this.logger.log(`mapping api id ${id} not found`);
        resData.appData = null;
        return resData;
      }

      await this.requestParamService.createRequestParamList(
        updateMappingApiDto.requestParams,
        id,
      );

      await this.responseParamService.createResponseParamList(
        updateMappingApiDto.responseParams,
        id,
      );

      mappingApi.fromCreateMappingApiDto(updateMappingApiDto);
      await this.mappingApiRepo.save(mappingApi);
      resData.message = 'Update mapping api success';
      this.logger.log(`update by id ${id} success`);
      resData.appData = mappingApi;
      return resData;
    } catch (error) {
      this.logger.error(`update by id ${id} have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async remove(id: number): Promise<ResponseData> {
    const resData = new ResponseData();
    try {
      this.logger.log(`remove by id ${id}`);
      const mappingApi = await this.mappingApiRepo.findOne({
        where: {
          isDeleted: false,
          id,
        },
      });

      if (mappingApi === null) {
        resData.hasError = true;
        resData.message = 'Mapping api id not found';
        this.logger.log(`mapping api id ${id} not found`);
        resData.appData = null;
        return resData;
      }
      await this.requestParamService.removeByMappingApiId(mappingApi.id);
      await this.responseParamService.removeByMappingApiId(mappingApi.id);

      mappingApi.setIsDelete(true);
      await this.mappingApiRepo.save(mappingApi);

      resData.message = 'Delete mapping api success';
      this.logger.log(`remove by id ${id} success`);
      // return `This action removes a #${id} mappingApi`;
      return resData;
    } catch (error) {
      this.logger.error(`remove by id ${id} have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async removeAllByThirdPartyApiId(thirdPartyApiId: number): Promise<ResponseData> {
    const resData = new ResponseData();
    try {
      this.logger.log(`remove all by third party api id ${thirdPartyApiId}`);
      const mappingApis = await this.mappingApiRepo.find({
        where: {
          isDeleted: false,
          thirdPartyApiId,
        },
      });

      for(let i = 0; i < mappingApis.length; i++) {
        await this.requestParamService.removeByMappingApiId(mappingApis[i].id);
        await this.responseParamService.removeByMappingApiId(mappingApis[i].id);
        mappingApis[i].setIsDelete(true);
      }
      await this.mappingApiRepo.save(mappingApis);

      resData.message = 'Delete mapping api success';
      this.logger.log(`remove all by third party api id ${thirdPartyApiId} success`);
      // return `This action removes a #${id} mappingApi`;
      return resData;
    } catch (error) {
      this.logger.error(`remove all by thirt party api id ${thirdPartyApiId} have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async removeAllByTypeBrandId(typeBrandId: number): Promise<ResponseData> {
    const resData = new ResponseData();
    try {
      this.logger.log(`remove all by type brand id ${typeBrandId}`);
      const mappingApis = await this.mappingApiRepo.find({
        where: {
          isDeleted: false,
          typeBrandId,
        },
      });

      for(let i = 0; i < mappingApis.length; i++) {
        await this.requestParamService.removeByMappingApiId(mappingApis[i].id);
        await this.responseParamService.removeByMappingApiId(mappingApis[i].id);
        mappingApis[i].setIsDelete(true);
      }
      await this.mappingApiRepo.save(mappingApis);

      resData.message = 'Delete mapping api success';
      this.logger.log(`remove all type brand id ${typeBrandId} success`);
      // return `This action removes a #${id} mappingApi`;
      return resData;
    } catch (error) {
      this.logger.error(`remove all type brand id ${typeBrandId} have error: ${error}`);
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async request(
    key: string,
    name: string,
    method: string,
    type: string,
    body: any,
    apiKey: any,
    query: any,
  ): Promise<ResponseData | any> {
    let resData = new ResponseData();
    try {
      this.logger.log(`request key ${key}, name ${name}, method ${method}`);

      // get authorization kiosk
      resData = await this.authorizationKioskService.findOneByApiKey(apiKey);
      if(resData.hasError) {
        throw new UnauthorizedException(resData);
      }

      resData = await this.typeBrandDeviceService.findOneByKey(key);
      if (resData.hasError) {
        return resData;
      }

      const typeBrandDevice = resData.appData;
      const mappingApis = await this.mappingApiRepo.find({
        where: {
          isDeleted: false,
          typeBrandId: typeBrandDevice.id,
          name,
          method,
        },
      });

      if (mappingApis.length === 0) {
        resData.hasError = true;
        resData.appData = null;
        resData.message = 'Endpoint not found';
        this.logger.log(`name ${name} not found`);
        return resData;
      }
      this.logger.log(`Mapping api list: ${JSON.stringify(mappingApis)}`);

      let mappingApi: MappingApi;

      if (mappingApis.length > 1) {
        const requestHeaderParam = Object.keys(body)[0];
        const mappingApis = await this.mappingApiRepo.find({
          where: {
            isDeleted: false,
            typeBrandId: typeBrandDevice.id,
            name,
            method,
            requestHeaderParam,
          },
        });

        if (mappingApis.length === 0) {
          resData.hasError = true;
          resData.appData = null;
          resData.message = 'Endpoint not found';
          this.logger.log(`name ${name} not found`);
          return resData;
        }
        mappingApi = mappingApis[0];
      } else {
        mappingApi = mappingApis[0];
      }

      if (mappingApi.requestType !== type) {
        this.logger.log(`${mappingApi.requestType} != ${type}`);
        return null;
      }

      if (type === 'xml') {
        body = body[Object.keys(body)[0]];
      }

      // set up request
      let request = body;
      const requestParams =
        await this.requestParamService.findAllByMappingApiId(mappingApi.id);

      // check have request mapping param 
      if(requestParams.length > 0){
        request = this.mappingParamRequest(body, requestParams);
      }

      this.logger.log(`request: ${JSON.stringify(request)}`);

      // get Url of third party to send request
      resData = await this.thirdPartyApiService.findOne(
        mappingApi.thirdPartyApiId,
      );
      const thirdPartyApi = resData.appData;
      const url = `${thirdPartyApi.url}/${thirdPartyApi.name}`;

      // send request to third party
      let result: any;

      // get authorization kiosk
      resData = await this.authorizationKioskService.findOneByApiKey(apiKey);
      if(resData.hasError) {
        return resData;
      }

      //config 
      const authorizationKiosk = resData.appData;
      const option = {
        'Authorization': authorizationKiosk.token,
        'x-api-key': authorizationKiosk.token,
      };
      const param = {
        "org-id": authorizationKiosk.organizationId,
        ...query
      }

      switch (thirdPartyApi.method) {
        case 'GET':
          result = await this.httpService.getRequest({
            url,
            option,
            payload: request,
            param,
          });
          break;
        case 'POST':
          result = await this.httpService.postRequest({
            url,
            option,
            payload: request,
            param,
          });
          break;
        case 'PUT':
          result = await this.httpService.putRequest({
            url,
            option,
            payload: request,
            param,
          });
          break;
        case 'DELETE':
          result = await this.httpService.deleteRequest({
            url,
            option,
            payload: request,
            param,
          });
          break;
      }
      
      this.logger.log(`reponse PMS: ${JSON.stringify(result)}`);
      
      // set up response mapping param
      let response = result;

      // get response param
      const responseParams =
        await this.responseParamService.findAllByMappingApiId(mappingApi.id);
      // check have response mapping param
      if (responseParams.length > 0 && !response.catch) {
        console.log(response);
        // get response code
        const responseCodes = 
          await this.responseCodeService.findAllMappingApiId(mappingApi.id);
        const listResponseCode = responseCodes.appData;
        // mapping response param
        response = this.mappingParamResponse(result, responseParams, listResponseCode);
      }
      let data = response;
      if (data.catch) {
        data = response.data;
      }

      if (mappingApi.responseType === 'xml') {
        const builder = new xml2js.Builder();
        data = builder.buildObject({ root: data });
        this.logger.log(`response: ${data}`);
      } else {
        this.logger.log(`response: ${JSON.stringify(data)}`);
      }
      
      this.logger.log(
        `request key ${key}, name ${name}, method ${method} success`,
      );
      if (response.catch) {
        response.data = data;
        return response;
      }
      return data;
    } catch (error) {
      this.logger.error(
        `request key ${key}, name ${name}, method ${method} have error: ${error}`,
      );
      resData.appData = null;
      resData.hasError = true;
      resData.message = 'Has something error when handle.';
      return resData;
    }
  }

  async getAll(): Promise<ResponseData> {
    const res = new ResponseData();

    try {
      const retrievingData = await this.mappingApiRepo.findBy({
        isDeleted: false,
      });
      this.logger.log('[retrieving data]: ' + JSON.stringify(retrievingData));

      res.appData = retrievingData;
      res.message = 'Get all APIs success';
      return res;
    } catch (error) {
      this.logger.error('[get all]: ' + JSON.stringify(error));
      res.hasError = true;
      res.message = 'something wrong just happened';
      return res;
    }
  }

  mappingParamRequest(body: any, requestParams: CreateRequestParamDto[]) {
    this.logger.log(`mapping param request`);
    let request = {};
    for (let i = 0; i < requestParams.length; i++) {
      if (body) {
        if (requestParams[i].paramDefault && requestParams[i].paramChange) {
          if (body[requestParams[i].paramDefault]) {
            if (requestParams[i].children.length > 0) {
              if (requestParams[i].type.length > 1) {
                if (!(requestParams[i].paramChange in request)) {
                  request[requestParams[i].paramChange] = [];
                }
                request[requestParams[i].paramChange].push(
                  this.mappingParamRequest(
                    body[requestParams[i].paramDefault][0],
                    requestParams[i].children,
                  ),
                );
              } else {
                request[requestParams[i].paramChange] = {
                  ...request[requestParams[i].paramChange],
                  ...this.mappingParamRequest(
                    body[requestParams[i].paramDefault],
                    requestParams[i].children,
                  ),
                };
              }
            } else {
              request[requestParams[i].paramChange] = TYPE_DATA_FUNCTION[
                requestParams[i].type.join()
              ](body[requestParams[i].paramDefault]);
            }
          } else {
            request[requestParams[i].paramChange] = "";
          }
        } else if (requestParams[i].paramDefault) {
          if (requestParams[i].children.length > 0) {
            if (requestParams[i].type.length > 1) {
              request = {
                ...request,
                ...this.mappingParamRequest(
                  body[requestParams[i].paramDefault][0],
                  requestParams[i].children,
                ),
              };
            } else {
              request = {
                ...request,
                ...this.mappingParamRequest(
                  body[requestParams[i].paramDefault],
                  requestParams[i].children,
                ),
              };
            }
          }
        } else if (requestParams[i].paramChange) {
          if (requestParams[i].children.length > 0) {
            if (requestParams[i].type.length > 1) {
              if (!(requestParams[i].paramChange in request)) {
                request[requestParams[i].paramChange] = [];
              }
              request[requestParams[i].paramChange].push(
                this.mappingParamRequest(body, requestParams[i].children),
              );
            } else {
              request[requestParams[i].paramChange] = this.mappingParamRequest(
                body,
                requestParams[i].children,
              );
            }
          }
        }
      } else {
        if (requestParams[i].paramChange) {
          if (requestParams[i].children.length > 0) {
            if (requestParams[i].type.length > 1) {
              if (!(requestParams[i].paramChange in request)) {
                request[requestParams[i].paramChange] = [];
              }
              request[requestParams[i].paramChange].push(
                this.mappingParamRequest(null, requestParams[i].children),
              );
            } else {
              request[requestParams[i].paramChange] = this.mappingParamRequest(
                null,
                requestParams[i].children,
              );
            }
          } else {
            request[requestParams[i].paramChange] = "";
          }
        }
      }
      if (requestParams[i].defaultData) {
        if (TYPE_DATA_FUNCTION[requestParams[i].type.join()]) {
          request[requestParams[i].paramChange] = TYPE_DATA_FUNCTION[
            requestParams[i].type.join()
          ](requestParams[i].defaultData);
        }
        request[requestParams[i].paramChange] = requestParams[i].defaultData;
      }
    }
    return request;
  }

  mappingParamResponse(body: any, responseParams: CreateResponseParamDto[], listResponseCode: ResponseCode[]) {
    this.logger.log(`mapping param response`);
    let response = {};
    for (let i = 0; i < responseParams.length; i++) {
      if (body) {
        if (responseParams[i].paramDefault && responseParams[i].paramChange) {
          if (responseParams[i].children.length > 0) {
            if (responseParams[i].type.length > 1) {
              if (responseParams[i].type.includes('response_code')) {}
              response[responseParams[i].paramChange] = [];
              response[responseParams[i].paramChange].push(
                this.mappingParamResponse(
                  body[responseParams[i].paramDefault][0],
                  responseParams[i].children,
                  listResponseCode,
                ),
              );
            } else {
              response[responseParams[i].paramChange] =
                this.mappingParamResponse(
                  body[responseParams[i].paramDefault],
                  responseParams[i].children,
                  listResponseCode,
                );
            }
          } else {
            if (responseParams[i].type.length > 1 && body[responseParams[i].paramDefault]) {
              if (responseParams[i].type.includes('response_code')) {
                if (listResponseCode.length > 0) {
                  const itemChange = listResponseCode.find((item) => item.codeDefault == body[responseParams[i].paramDefault]);
                  if (itemChange) {
                    response[responseParams[i].paramChange] = itemChange.codeChange;
                  } else {
                    const itemDefault = listResponseCode.find((item) => item.default);
                    if (itemDefault) {
                      response[responseParams[i].paramChange] = itemDefault.codeChange;
                    } else {
                      response[responseParams[i].paramChange] = body[responseParams[i].paramDefault]
                    }
                  }
                } else {
                  response[responseParams[i].paramChange] = body[responseParams[i].paramDefault];
                }
              } else {
                response[responseParams[i].paramChange] = body[responseParams[i].paramDefault];
              } 
            } else if (body[responseParams[i].paramDefault]) {
              response[responseParams[i].paramChange] = TYPE_DATA_FUNCTION[
                responseParams[i].type.join()
              ](body[responseParams[i].paramDefault]);
            } else {
              response[responseParams[i].paramChange] = null;
            }
          }
        } else if (responseParams[i].paramDefault) {
          if (responseParams[i].children.length > 0) {
            if (responseParams[i].type.length > 1) {
              response = {
                ...response,
                ...this.mappingParamResponse(
                  body[responseParams[i].paramDefault][0],
                  responseParams[i].children,
                  listResponseCode,
                ),
              };
            } else {
              response = {
                ...response,
                ...this.mappingParamResponse(
                  body[responseParams[i].paramDefault],
                  responseParams[i].children,
                  listResponseCode,
                ),
              };
            }
          }
        } else if (responseParams[i].paramChange) {
          if (responseParams[i].children.length > 0) {
            if (responseParams[i].type.length > 1) {
              if (!(responseParams[i].paramChange in response)) {
                response[responseParams[i].paramChange] = [];
              }
              response[responseParams[i].paramChange].push(
                this.mappingParamResponse(body, responseParams[i].children, listResponseCode),
              );
            } else {
              response[responseParams[i].paramChange] =
                this.mappingParamResponse(body, responseParams[i].children, listResponseCode);
            }
          }
        }
      } else {
        if (responseParams[i].paramChange) {
          if (responseParams[i].children.length > 0) {
            if (responseParams[i].type.length > 1) {
              if (!(responseParams[i].paramChange in response)) {
                response[responseParams[i].paramChange] = [];
              }
              response[responseParams[i].paramChange].push(
                this.mappingParamRequest(null, responseParams[i].children),
              );
            } else {
              response[responseParams[i].paramChange] =
                this.mappingParamRequest(null, responseParams[i].children);
            }
          } else {
            response[responseParams[i].paramChange] = null;
          }
        }
      }
      if (responseParams[i].defaultData) {
        if (TYPE_DATA_FUNCTION[responseParams[i].type.join()]) {
          response[responseParams[i].paramChange] = TYPE_DATA_FUNCTION[
            responseParams[i].type.join()
          ](responseParams[i].defaultData);
        }
        response[responseParams[i].paramChange] = responseParams[i].defaultData;
      }
    }
    return response;
  }

  checkRequestAndResponseParams(requestParams = [], responseParams = []): ResponseData {
    this.logger.log(`check request and response param`);
    const resData = new ResponseData();
    const checkRequestParam = this.requestParamService.detect(requestParams);
    if (!checkRequestParam) {
      resData.hasError = true;
      resData.message = 'Please check request params';
      resData.appData = null;
      return resData;
    }

    const checkResponseParam = this.responseParamService.detect(responseParams);
    if (!checkResponseParam) {
      resData.hasError = true;
      resData.message = 'Please check response params';
      resData.appData = null;
      return resData;
    }

    return resData;
  }
}
