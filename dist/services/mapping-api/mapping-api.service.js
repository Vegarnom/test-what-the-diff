"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MappingApiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappingApiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const constant_1 = require("../../common/helper/constant");
const response_data_1 = require("../../common/params/response.data");
const typeorm_2 = require("typeorm");
const authorization_service_1 = require("../authorization-kiosk/authorization.service");
const request_http_service_1 = require("../request-http/request-http.service");
const request_param_service_1 = require("../request-param/request-param.service");
const response_code_service_1 = require("../response-code/response-code.service");
const response_param_service_1 = require("../response-param/response-param.service");
const third_party_api_service_1 = require("../third-party-api/third-party-api.service");
const type_brand_device_service_1 = require("../type-brand-device/type-brand-device.service");
const mapping_api_entity_1 = require("./entities/mapping-api.entity");
const type_device_service_1 = require("../type-device/type-device.service");
const brand_device_service_1 = require("../brand-device/brand-device.service");
const xml2js = require('xml2js');
let MappingApiService = MappingApiService_1 = class MappingApiService {
    constructor(mappingApiRepo, requestParamService, responseParamService, thirdPartyApiService, typeBrandDeviceService, httpService, responseCodeService, authorizationKioskService, typeDeviceService, brandDeviceService) {
        this.mappingApiRepo = mappingApiRepo;
        this.requestParamService = requestParamService;
        this.responseParamService = responseParamService;
        this.thirdPartyApiService = thirdPartyApiService;
        this.typeBrandDeviceService = typeBrandDeviceService;
        this.httpService = httpService;
        this.responseCodeService = responseCodeService;
        this.authorizationKioskService = authorizationKioskService;
        this.typeDeviceService = typeDeviceService;
        this.brandDeviceService = brandDeviceService;
        this.logger = new common_1.Logger(MappingApiService_1.name);
    }
    async create(createMappingApiDto) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`create mapping api ${JSON.stringify(createMappingApiDto)}`);
            resData = await this.thirdPartyApiService.findOne(createMappingApiDto.thirdPartyApiId);
            if (resData.hasError) {
                return resData;
            }
            resData = await this.typeBrandDeviceService.findOne(createMappingApiDto.typeBrandId);
            if (resData.hasError) {
                return resData;
            }
            resData = this.checkRequestAndResponseParams(createMappingApiDto.requestParams, createMappingApiDto.responseParams);
            if (resData.hasError) {
                this.logger.log(`${resData.message}`);
                return resData;
            }
            let mappingApi = new mapping_api_entity_1.MappingApi();
            mappingApi.fromCreateMappingApiDto(createMappingApiDto);
            mappingApi = await this.mappingApiRepo.save(mappingApi);
            await this.requestParamService.createRequestParamList(createMappingApiDto.requestParams, mappingApi.id);
            await this.responseParamService.createResponseParamList(createMappingApiDto.responseParams, mappingApi.id);
            resData.message = 'Create mapping api success';
            this.logger.log(`create mapping api success`);
            resData.appData = mappingApi;
            return resData;
        }
        catch (error) {
            this.logger.error(`create have error: ${error}`);
            resData.appData = null;
            resData.hasError = true;
            resData.message = 'Has something error when handle.';
            return resData;
        }
    }
    async findAllByTypeBrandId(typeBrandId) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`find all mapping api`);
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
            };
            resData.appData = response;
            resData.message = 'Get mapping api list success';
            this.logger.log(`find all mapping api success`);
            return resData;
        }
        catch (error) {
            this.logger.error(`find all have error: ${error}`);
            resData.appData = null;
            resData.hasError = true;
            resData.message = 'Has something error when handle.';
            return resData;
        }
    }
    async findOne(id) {
        const resData = new response_data_1.ResponseData();
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
        }
        catch (error) {
            this.logger.error(`find one by id ${id} have error: ${error}`);
            resData.appData = null;
            resData.hasError = true;
            resData.message = 'Has something error when handle.';
            return resData;
        }
    }
    async update(id, updateMappingApiDto) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`update by id ${id}`);
            resData = await this.thirdPartyApiService.findOne(updateMappingApiDto.thirdPartyApiId);
            if (resData.hasError) {
                return resData;
            }
            resData = await this.typeBrandDeviceService.findOne(updateMappingApiDto.typeBrandId);
            if (resData.hasError) {
                return resData;
            }
            resData = this.checkRequestAndResponseParams(updateMappingApiDto.requestParams, updateMappingApiDto.responseParams);
            if (resData.hasError) {
                this.logger.log(`${resData.message}`);
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
                resData.appData = null;
                return resData;
            }
            await this.requestParamService.createRequestParamList(updateMappingApiDto.requestParams, id);
            await this.responseParamService.createResponseParamList(updateMappingApiDto.responseParams, id);
            mappingApi.fromCreateMappingApiDto(updateMappingApiDto);
            await this.mappingApiRepo.save(mappingApi);
            resData.message = 'Update mapping api success';
            this.logger.log(`update by id ${id} success`);
            resData.appData = mappingApi;
            return resData;
        }
        catch (error) {
            this.logger.error(`update by id ${id} have error: ${error}`);
            resData.appData = null;
            resData.hasError = true;
            resData.message = 'Has something error when handle.';
            return resData;
        }
    }
    async remove(id) {
        const resData = new response_data_1.ResponseData();
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
            return resData;
        }
        catch (error) {
            this.logger.error(`remove by id ${id} have error: ${error}`);
            resData.appData = null;
            resData.hasError = true;
            resData.message = 'Has something error when handle.';
            return resData;
        }
    }
    async removeAllByThirdPartyApiId(thirdPartyApiId) {
        const resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`remove all by third party api id ${thirdPartyApiId}`);
            const mappingApis = await this.mappingApiRepo.find({
                where: {
                    isDeleted: false,
                    thirdPartyApiId,
                },
            });
            for (let i = 0; i < mappingApis.length; i++) {
                await this.requestParamService.removeByMappingApiId(mappingApis[i].id);
                await this.responseParamService.removeByMappingApiId(mappingApis[i].id);
                mappingApis[i].setIsDelete(true);
            }
            await this.mappingApiRepo.save(mappingApis);
            resData.message = 'Delete mapping api success';
            this.logger.log(`remove all by third party api id ${thirdPartyApiId} success`);
            return resData;
        }
        catch (error) {
            this.logger.error(`remove all by thirt party api id ${thirdPartyApiId} have error: ${error}`);
            resData.appData = null;
            resData.hasError = true;
            resData.message = 'Has something error when handle.';
            return resData;
        }
    }
    async removeAllByTypeBrandId(typeBrandId) {
        const resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`remove all by type brand id ${typeBrandId}`);
            const mappingApis = await this.mappingApiRepo.find({
                where: {
                    isDeleted: false,
                    typeBrandId,
                },
            });
            for (let i = 0; i < mappingApis.length; i++) {
                await this.requestParamService.removeByMappingApiId(mappingApis[i].id);
                await this.responseParamService.removeByMappingApiId(mappingApis[i].id);
                mappingApis[i].setIsDelete(true);
            }
            await this.mappingApiRepo.save(mappingApis);
            resData.message = 'Delete mapping api success';
            this.logger.log(`remove all type brand id ${typeBrandId} success`);
            return resData;
        }
        catch (error) {
            this.logger.error(`remove all type brand id ${typeBrandId} have error: ${error}`);
            resData.appData = null;
            resData.hasError = true;
            resData.message = 'Has something error when handle.';
            return resData;
        }
    }
    async request(key, name, method, type, body, apiKey, query) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`request key ${key}, name ${name}, method ${method}`);
            resData = await this.authorizationKioskService.findOneByApiKey(apiKey);
            if (resData.hasError) {
                throw new common_1.UnauthorizedException(resData);
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
            let mappingApi;
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
            }
            else {
                mappingApi = mappingApis[0];
            }
            if (mappingApi.requestType !== type) {
                this.logger.log(`${mappingApi.requestType} != ${type}`);
                return null;
            }
            if (type === 'xml') {
                body = body[Object.keys(body)[0]];
            }
            let request = body;
            const requestParams = await this.requestParamService.findAllByMappingApiId(mappingApi.id);
            if (requestParams.length > 0) {
                request = this.mappingParamRequest(body, requestParams);
            }
            this.logger.log(`request: ${JSON.stringify(request)}`);
            resData = await this.thirdPartyApiService.findOne(mappingApi.thirdPartyApiId);
            const thirdPartyApi = resData.appData;
            const url = `${thirdPartyApi.url}/${thirdPartyApi.name}`;
            let result;
            resData = await this.authorizationKioskService.findOneByApiKey(apiKey);
            if (resData.hasError) {
                return resData;
            }
            let authorizationKiosk = resData.appData;
            if (authorizationKiosk.expireToken && authorizationKiosk.expireToken <= new Date()) {
                resData = await this.authorizationKioskService.resetAccessToken(authorizationKiosk);
                if (resData.hasError) {
                    return resData;
                }
                authorizationKiosk = resData.appData;
            }
            const option = {
                'Authorization': authorizationKiosk.token,
                'x-api-key': authorizationKiosk.token,
            };
            const param = Object.assign({ "org-id": authorizationKiosk.organizationId }, query);
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
            let response = result;
            const responseParams = await this.responseParamService.findAllByMappingApiId(mappingApi.id);
            if (responseParams.length > 0 && !response.catch) {
                const responseCodes = await this.responseCodeService.findAllMappingApiId(mappingApi.id);
                const listResponseCode = responseCodes.appData;
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
            }
            else {
                this.logger.log(`response: ${JSON.stringify(data)}`);
            }
            this.logger.log(`request key ${key}, name ${name}, method ${method} success`);
            if (response.catch) {
                response.data = data;
                return response;
            }
            return data;
        }
        catch (error) {
            this.logger.error(`request key ${key}, name ${name}, method ${method} have error: ${error}`);
            resData.appData = null;
            resData.hasError = true;
            resData.message = 'Has something error when handle.';
            return resData;
        }
    }
    async getAll() {
        const res = new response_data_1.ResponseData();
        try {
            const retrievingData = await this.mappingApiRepo.findBy({
                isDeleted: false,
            });
            this.logger.log('[retrieving data]: ' + JSON.stringify(retrievingData));
            res.appData = retrievingData;
            res.message = 'Get all APIs success';
            return res;
        }
        catch (error) {
            this.logger.error('[get all]: ' + JSON.stringify(error));
            res.hasError = true;
            res.message = 'something wrong just happened';
            return res;
        }
    }
    mappingParamRequest(body, requestParams) {
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
                                request[requestParams[i].paramChange].push(this.mappingParamRequest(body[requestParams[i].paramDefault][0], requestParams[i].children));
                            }
                            else {
                                request[requestParams[i].paramChange] = Object.assign(Object.assign({}, request[requestParams[i].paramChange]), this.mappingParamRequest(body[requestParams[i].paramDefault], requestParams[i].children));
                            }
                        }
                        else {
                            request[requestParams[i].paramChange] = constant_1.TYPE_DATA_FUNCTION[requestParams[i].type.join()](body[requestParams[i].paramDefault]);
                        }
                    }
                    else {
                        request[requestParams[i].paramChange] = "";
                    }
                }
                else if (requestParams[i].paramDefault) {
                    if (requestParams[i].children.length > 0) {
                        if (requestParams[i].type.length > 1) {
                            request = Object.assign(Object.assign({}, request), this.mappingParamRequest(body[requestParams[i].paramDefault][0], requestParams[i].children));
                        }
                        else {
                            request = Object.assign(Object.assign({}, request), this.mappingParamRequest(body[requestParams[i].paramDefault], requestParams[i].children));
                        }
                    }
                }
                else if (requestParams[i].paramChange) {
                    if (requestParams[i].children.length > 0) {
                        if (requestParams[i].type.length > 1) {
                            if (!(requestParams[i].paramChange in request)) {
                                request[requestParams[i].paramChange] = [];
                            }
                            request[requestParams[i].paramChange].push(this.mappingParamRequest(body, requestParams[i].children));
                        }
                        else {
                            request[requestParams[i].paramChange] = this.mappingParamRequest(body, requestParams[i].children);
                        }
                    }
                }
            }
            else {
                if (requestParams[i].paramChange) {
                    if (requestParams[i].children.length > 0) {
                        if (requestParams[i].type.length > 1) {
                            if (!(requestParams[i].paramChange in request)) {
                                request[requestParams[i].paramChange] = [];
                            }
                            request[requestParams[i].paramChange].push(this.mappingParamRequest(null, requestParams[i].children));
                        }
                        else {
                            request[requestParams[i].paramChange] = this.mappingParamRequest(null, requestParams[i].children);
                        }
                    }
                    else {
                        request[requestParams[i].paramChange] = "";
                    }
                }
            }
            if (requestParams[i].defaultData) {
                if (constant_1.TYPE_DATA_FUNCTION[requestParams[i].type.join()]) {
                    request[requestParams[i].paramChange] = constant_1.TYPE_DATA_FUNCTION[requestParams[i].type.join()](requestParams[i].defaultData);
                }
                request[requestParams[i].paramChange] = requestParams[i].defaultData;
            }
        }
        return request;
    }
    mappingParamResponse(body, responseParams, listResponseCode) {
        this.logger.log(`mapping param response`);
        let response = {};
        for (let i = 0; i < responseParams.length; i++) {
            if (body) {
                if (responseParams[i].paramDefault && responseParams[i].paramChange) {
                    if (responseParams[i].children.length > 0) {
                        if (responseParams[i].type.length > 1) {
                            if (responseParams[i].type.includes('response_code')) { }
                            response[responseParams[i].paramChange] = [];
                            response[responseParams[i].paramChange].push(this.mappingParamResponse(body[responseParams[i].paramDefault][0], responseParams[i].children, listResponseCode));
                        }
                        else {
                            response[responseParams[i].paramChange] =
                                this.mappingParamResponse(body[responseParams[i].paramDefault], responseParams[i].children, listResponseCode);
                        }
                    }
                    else {
                        if (responseParams[i].type.length > 1 && body[responseParams[i].paramDefault]) {
                            if (responseParams[i].type.includes('response_code')) {
                                if (listResponseCode.length > 0) {
                                    const itemChange = listResponseCode.find((item) => item.codeDefault == body[responseParams[i].paramDefault]);
                                    if (itemChange) {
                                        response[responseParams[i].paramChange] = itemChange.codeChange;
                                    }
                                    else {
                                        const itemDefault = listResponseCode.find((item) => item.default);
                                        if (itemDefault) {
                                            response[responseParams[i].paramChange] = itemDefault.codeChange;
                                        }
                                        else {
                                            response[responseParams[i].paramChange] = body[responseParams[i].paramDefault];
                                        }
                                    }
                                }
                                else {
                                    response[responseParams[i].paramChange] = body[responseParams[i].paramDefault];
                                }
                            }
                            else {
                                response[responseParams[i].paramChange] = body[responseParams[i].paramDefault];
                            }
                        }
                        else if (body[responseParams[i].paramDefault]) {
                            response[responseParams[i].paramChange] = constant_1.TYPE_DATA_FUNCTION[responseParams[i].type.join()](body[responseParams[i].paramDefault]);
                        }
                        else {
                            response[responseParams[i].paramChange] = null;
                        }
                    }
                }
                else if (responseParams[i].paramDefault) {
                    if (responseParams[i].children.length > 0) {
                        if (responseParams[i].type.length > 1) {
                            response = Object.assign(Object.assign({}, response), this.mappingParamResponse(body[responseParams[i].paramDefault][0], responseParams[i].children, listResponseCode));
                        }
                        else {
                            response = Object.assign(Object.assign({}, response), this.mappingParamResponse(body[responseParams[i].paramDefault], responseParams[i].children, listResponseCode));
                        }
                    }
                }
                else if (responseParams[i].paramChange) {
                    if (responseParams[i].children.length > 0) {
                        if (responseParams[i].type.length > 1) {
                            if (!(responseParams[i].paramChange in response)) {
                                response[responseParams[i].paramChange] = [];
                            }
                            response[responseParams[i].paramChange].push(this.mappingParamResponse(body, responseParams[i].children, listResponseCode));
                        }
                        else {
                            response[responseParams[i].paramChange] =
                                this.mappingParamResponse(body, responseParams[i].children, listResponseCode);
                        }
                    }
                }
            }
            else {
                if (responseParams[i].paramChange) {
                    if (responseParams[i].children.length > 0) {
                        if (responseParams[i].type.length > 1) {
                            if (!(responseParams[i].paramChange in response)) {
                                response[responseParams[i].paramChange] = [];
                            }
                            response[responseParams[i].paramChange].push(this.mappingParamRequest(null, responseParams[i].children));
                        }
                        else {
                            response[responseParams[i].paramChange] =
                                this.mappingParamRequest(null, responseParams[i].children);
                        }
                    }
                    else {
                        response[responseParams[i].paramChange] = null;
                    }
                }
            }
            if (responseParams[i].defaultData) {
                if (constant_1.TYPE_DATA_FUNCTION[responseParams[i].type.join()]) {
                    response[responseParams[i].paramChange] = constant_1.TYPE_DATA_FUNCTION[responseParams[i].type.join()](responseParams[i].defaultData);
                }
                response[responseParams[i].paramChange] = responseParams[i].defaultData;
            }
        }
        return response;
    }
    checkRequestAndResponseParams(requestParams = [], responseParams = []) {
        this.logger.log(`check request and response param`);
        const resData = new response_data_1.ResponseData();
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
};
MappingApiService = MappingApiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(mapping_api_entity_1.MappingApi)),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => third_party_api_service_1.ThirdPartyApiService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => type_brand_device_service_1.TypeBrandDeviceService))),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => response_code_service_1.ResponseCodeService))),
    __param(8, (0, common_1.Inject)((0, common_1.forwardRef)(() => type_device_service_1.TypeDeviceService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        request_param_service_1.RequestParamService,
        response_param_service_1.ResponseParamService,
        third_party_api_service_1.ThirdPartyApiService,
        type_brand_device_service_1.TypeBrandDeviceService,
        request_http_service_1.RequestHttpService,
        response_code_service_1.ResponseCodeService,
        authorization_service_1.AuthorizationKioskService,
        type_device_service_1.TypeDeviceService,
        brand_device_service_1.BrandDeviceService])
], MappingApiService);
exports.MappingApiService = MappingApiService;
//# sourceMappingURL=mapping-api.service.js.map