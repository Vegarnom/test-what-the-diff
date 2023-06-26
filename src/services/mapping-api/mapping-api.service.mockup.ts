import { TYPE_DATA, TYPE_DATA_FUNCTION } from 'src/common/helper/constant';
import { ResponseData } from 'src/common/params/response.data';
import { CreateRequestParamDto } from '../request-param/dto/create-request-param.dto';
import { RequestParam } from '../request-param/entities/request-param.entity';
import { CreateResponseParamDto } from '../response-param/dto/create-response-param.dto';
import { ResponseParam } from '../response-param/entities/response-param.entity';
import { CreateMappingApiDto } from './dto/create-mapping-api.dto';
import { UpdateMappingApiDto } from './dto/update-mapping-api.dto';
import { MappingApi } from './entities/mapping-api.entity';

const requestParam: RequestParam = {
  id: 10000,
  paramDefault: 'guest',
  paramChange: 'customer',
  type: 'object',
  defaultData: '',
  parentId: null,
  mappingApiId: null,
  isDeleted: false,
  deletedDate: null,
  createdAt: null,
  updatedAt: null,
};

const requestParamChild1: RequestParam = {
  id: 10001,
  paramDefault: 'guestAge',
  paramChange: 'customerAge',
  type: 'int',
  defaultData: '',
  parentId: 10000,
  mappingApiId: null,
  isDeleted: false,
  deletedDate: null,
  createdAt: null,
  updatedAt: null,
};

const requestParamChild2: RequestParam = {
  id: 10002,
  paramDefault: 'guestName',
  paramChange: 'customerName',
  type: 'string',
  defaultData: '',
  parentId: 10000,
  mappingApiId: null,
  isDeleted: false,
  deletedDate: null,
  createdAt: null,
  updatedAt: null,
};

const requestParams = new CreateRequestParamDto();
requestParams.fromRequestParam(requestParam);
requestParams.children.push(
  new CreateRequestParamDto().fromRequestParam(requestParamChild1),
  new CreateRequestParamDto().fromRequestParam(requestParamChild2),
);

const responseParam: RequestParam = {
  id: 10003,
  paramDefault: '',
  paramChange: 'checkin',
  type: 'object',
  defaultData: '',
  parentId: null,
  mappingApiId: null,
  isDeleted: false,
  deletedDate: null,
  createdAt: null,
  updatedAt: null,
};

const responseParamChild1: ResponseParam = {
  id: 10004,
  paramDefault: 'checkinTime',
  paramChange: 'checkinDate',
  type: 'int',
  defaultData: '',
  parentId: 10003,
  mappingApiId: null,
  isDeleted: false,
  deletedDate: null,
  createdAt: null,
  updatedAt: null,
};

const responseParamChild2: ResponseParam = {
  id: 10005,
  paramDefault: 'checkoutTime',
  paramChange: 'checkoutDate',
  type: 'string',
  defaultData: '',
  parentId: 10003,
  mappingApiId: null,
  isDeleted: false,
  deletedDate: null,
  createdAt: null,
  updatedAt: null,
};

const responseParams = new CreateResponseParamDto();
responseParams.fromRequestParam(responseParam);
responseParams.children.push(
  new CreateResponseParamDto().fromRequestParam(responseParamChild1),
  new CreateResponseParamDto().fromRequestParam(responseParamChild2),
);

export const mappingApiStub = (): CreateMappingApiDto | UpdateMappingApiDto => {
  return {
    id: 10000,
    endpoint: 'findjson',
    requestHeaderParam: '',
    name: 'find reservation json',
    note: '',
    description: '',
    thirdPartyApiId: 1,
    typeBrandId: 1,
    requestParams: [requestParams],
    responseParams: [responseParams],
    method: 'POST',
    requestType: 'json',
    responseType: 'json',
  };
};

export const mockupMappingApiService = {
  create: jest.fn((x) => create(x)),
  findAllByTypeBrandId: jest.fn((x) => findAllByTypeBrandId(x)),
  findOne: jest.fn((x) => findOne(x)),
  update: jest.fn((x, y) => update(x, y)),
  remove: jest.fn((x) => remove(x)),
  request: jest.fn((x, y, z, a, b) => request(x, y, z, a, b)),
};

const create = (
  createMappingApiDto: CreateMappingApiDto | UpdateMappingApiDto,
): ResponseData => {
  let resData = new ResponseData();

  if (
    createMappingApiDto.requestParams.length > 0 &&
    createMappingApiDto.responseParams.length > 0
  ) {
    resData = checkRequestAndResponseParams(
      createMappingApiDto.requestParams,
      createMappingApiDto.responseParams,
    );
    if (resData.hasError) {
      return resData;
    }

    const mappingApi = new MappingApi();
    mappingApi.fromCreateMappingApiDto(createMappingApiDto);

    resData.message = 'Create mapping api success';
    resData.appData = mappingApi;
    // return 'This action adds a new mappingApi';
    return resData;
  } else {
    resData.hasError = true;
    resData.message =
      'Please check request param and reponse param, they not empty.';
    return resData;
  }
};

const findAllByTypeBrandId = (id: number): ResponseData => {
  const resData = new ResponseData();
  const mappingApi = new MappingApi();
  mappingApi.fromCreateMappingApiDto(mappingApiStub());

  resData.appData = [mappingApi];
  resData.message = 'Get mapping api list success';
  // return `This action returns all mappingApi`;
  return resData;
};

const findOne = (id: number): ResponseData => {
  const resData = new ResponseData();
  if (id < 1) {
    resData.hasError = true;
    resData.message = 'Mapping api id is not validate';
    return resData;
  }
  if (id != 10000) {
    resData.hasError = true;
    resData.message = 'Mapping api id not found';
    return resData;
  }
  const mappingApi = new MappingApi();
  mappingApi.fromCreateMappingApiDto(mappingApiStub());
  mappingApi['requestParams'] = [requestParam];
  mappingApi['responseParams'] = [responseParam];

  resData.appData = mappingApi;
  resData.message = 'Get mapping api success';
  return resData;
};

const update = (id: number, createMappingApiDto: CreateMappingApiDto) => {
  let resData = new ResponseData();
  if (id < 1) {
    resData.hasError = true;
    resData.message = 'Mapping api id is not validate';
    return resData;
  }
  if (id != 10000) {
    resData.hasError = true;
    resData.message = 'Mapping api id not found';
    return resData;
  }

  resData = create(createMappingApiDto);
  if (resData.hasError) {
    return resData;
  }

  resData.message = 'Update mapping api success';
  return resData;
};

const remove = (id: number): ResponseData => {
  const resData = new ResponseData();
  if (id < 1) {
    resData.hasError = true;
    resData.message = 'Mapping api id is not validate';
    return resData;
  }
  if (id != 10000) {
    resData.hasError = true;
    resData.message = 'Mapping api id not found';
    return resData;
  }
  resData.message = 'Delete mapping api success';
  return resData;
};

const request = (
  key: string,
  endpoint: string,
  method: string,
  type: string,
  body: any,
): ResponseData | any => {
  const mappingApi = new MappingApi();
  mappingApi.fromCreateMappingApiDto(mappingApiStub());
  if (mappingApi.requestType != type) {
    return null;
  }

  const request = mappingParamRequest(body, [requestParams]);

  const result = {
    checkinTime: '11/07/2000',
    checkoutTime: '12/07/2000',
    customerName: 'Trung',
    customerAge: 17,
    amount: 1700,
  };

  let response = mappingParamRequest(result, [responseParams]);
  if (mappingApi.responseType == 'xml') {
    response = OBJtoXML({ root: response });
  }
  return {
    request,
    response,
  };
};

const mappingParamRequest = (body: any, requestParams: any[]) => {
  let request = {};
  for (let i = 0; i < requestParams.length; i++) {
    if (requestParams[i].paramDefault && requestParams[i].paramChange) {
      if (requestParams[i].children.length > 0) {
        if (requestParams[i].type.length > 1) {
          request[requestParams[i].paramChange] = [];
          request[requestParams[i].paramChange].push(
            mappingParamRequest(
              body[requestParams[i].paramDefault][0],
              requestParams[i].children,
            ),
          );
        } else {
          request[requestParams[i].paramChange] = mappingParamRequest(
            body[requestParams[i].paramDefault],
            requestParams[i].children,
          );
        }
      } else {
        request[requestParams[i].paramChange] = TYPE_DATA_FUNCTION[
          requestParams[i].type.join()
        ](body[requestParams[i].paramDefault]);
      }
    } else if (requestParams[i].paramDefault) {
      if (requestParams[i].children.length > 0) {
        if (requestParams[i].type.length > 1) {
          request = {
            ...request,
            ...mappingParamRequest(
              body[requestParams[i].paramDefault][0],
              requestParams[i].children,
            ),
          };
        } else {
          request = {
            ...request,
            ...mappingParamRequest(
              body[requestParams[i].paramDefault],
              requestParams[i].children,
            ),
          };
        }
      }
    } else if (requestParams[i].paramChange) {
      if (requestParams[i].children.length > 0) {
        if (requestParams[i].type.length > 1) {
          request[requestParams[i].paramChange] = [];
          request[requestParams[i].paramChange].push(
            mappingParamRequest(body, requestParams[i].children),
          );
        } else {
          request[requestParams[i].paramChange] = mappingParamRequest(
            body,
            requestParams[i].children,
          );
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
};

const mappingParamResponse = (body: any, responseParams: any[]) => {
  let response = {};
  for (let i = 0; i < responseParams.length; i++) {
    if (responseParams[i].paramDefault && responseParams[i].paramChange) {
      if (responseParams[i].children.length > 0) {
        if (responseParams[i].type.length > 1) {
          response[responseParams[i].paramChange] = [];
          response[responseParams[i].paramChange].push(
            mappingParamResponse(
              body[responseParams[i].paramDefault][0],
              responseParams[i].children,
            ),
          );
        } else {
          response[responseParams[i].paramChange] = mappingParamResponse(
            body[responseParams[i].paramDefault],
            responseParams[i].children,
          );
        }
      } else {
        response[responseParams[i].paramChange] = TYPE_DATA_FUNCTION[
          responseParams[i].type.join()
        ](body[responseParams[i].paramDefault]);
      }
    } else if (responseParams[i].paramDefault) {
      if (responseParams[i].children.length > 0) {
        if (responseParams[i].type.length > 1) {
          response = {
            ...response,
            ...mappingParamResponse(
              body[responseParams[i].paramDefault][0],
              responseParams[i].children,
            ),
          };
        } else {
          response = {
            ...response,
            ...mappingParamResponse(
              body[responseParams[i].paramDefault],
              responseParams[i].children,
            ),
          };
        }
      }
    } else if (responseParams[i].paramChange) {
      if (responseParams[i].children.length > 0) {
        if (responseParams[i].type.length > 1) {
          response[responseParams[i].paramChange] = [];
          response[responseParams[i].paramChange].push(
            mappingParamResponse(body, responseParams[i].children),
          );
        } else {
          response[responseParams[i].paramChange] = mappingParamResponse(
            body,
            responseParams[i].children,
          );
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
};

const checkRequestAndResponseParams = (
  requestParams,
  responseParams,
): ResponseData => {
  const resData = new ResponseData();
  const checkRequestParam = detect(requestParams);
  if (!checkRequestParam) {
    resData.hasError = true;
    resData.message = 'Please check request params';
    resData.appData = null;
    return resData;
  }

  const checkResponseParam = detect(responseParams);
  if (!checkResponseParam) {
    resData.hasError = true;
    resData.message = 'Please check response params';
    resData.appData = null;
    return resData;
  }

  return resData;
};

const OBJtoXML = (obj) => {
  let xml = '';
  for (const prop in obj) {
    xml += obj[prop] instanceof Array ? '' : '<' + prop + '>';
    if (obj[prop] instanceof Array) {
      for (const array in obj[prop]) {
        xml += '<' + prop + '>';
        xml += OBJtoXML(new Object(obj[prop][array]));
        xml += '</' + prop + '>';
      }
    } else if (typeof obj[prop] == 'object') {
      xml += OBJtoXML(new Object(obj[prop]));
    } else {
      xml += obj[prop];
    }
    xml += obj[prop] instanceof Array ? '' : '</' + prop + '>';
  }
  xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
  return xml;
};

const detect = (createRequestParamDtoList: any[]): boolean => {
  for (let i = 0; i < createRequestParamDtoList.length; i++) {
    if (
      (createRequestParamDtoList[i].paramChange == '' &&
        createRequestParamDtoList[i].paramDefault == '') ||
      (createRequestParamDtoList[i].paramChange == '' &&
        createRequestParamDtoList[i].paramDefault == null) ||
      (createRequestParamDtoList[i].paramChange == null &&
        createRequestParamDtoList[i].paramDefault == '') ||
      (createRequestParamDtoList[i].paramChange == null &&
        createRequestParamDtoList[i].paramDefault == null) ||
      createRequestParamDtoList[i].type.length < 1
    ) {
      return false;
    } else {
      if (!detectType(createRequestParamDtoList[i])) {
        return false;
      }
      if (createRequestParamDtoList[i].children) {
        if (!detect(createRequestParamDtoList[i].children)) {
          return false;
        }
      }
    }
  }
  return true;
};

const detectType = (requestParam: any): boolean => {
  const arr: string[] = requestParam.type.map((element) => {
    return element.toLowerCase();
  });

  if (!checkIncluded(TYPE_DATA, arr)) {
    return false;
  }

  if (
    (!checkIncluded(arr, ['object']) && requestParam.children.length > 0) ||
    (!checkIncluded(arr, ['array']) && requestParam.type.length > 1)
  ) {
    return false;
  }

  requestParam.type = arr;
  return true;
};

const checkIncluded = (myArray, checkingArray): boolean => {
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
};

const findElementById = (requestParams: any[], id: number) => {
  for (let i = 0; i < requestParams.length; i++) {
    if (requestParams[i].id == id) {
      return requestParams[i];
    }
    if (requestParams[i].children) {
      const requestParam = findElementById(requestParams[i].children, id);
      if (requestParam) {
        return requestParam;
      }
    }
  }
  return null;
};
