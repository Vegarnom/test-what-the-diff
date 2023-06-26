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
var RequestParamService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestParamService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const constant_1 = require("../../common/helper/constant");
const response_data_1 = require("../../common/params/response.data");
const typeorm_2 = require("typeorm");
const create_request_param_dto_1 = require("./dto/create-request-param.dto");
const request_param_entity_1 = require("./entities/request-param.entity");
let RequestParamService = RequestParamService_1 = class RequestParamService {
    constructor(requestParamRepo) {
        this.requestParamRepo = requestParamRepo;
        this.logger = new common_1.Logger(RequestParamService_1.name);
    }
    async createRequestParam(createRequestParamDto, parentId) {
        try {
            this.logger.log(`create request param ${JSON.stringify(createRequestParamDto)}`);
            let requestParam = new request_param_entity_1.RequestParam();
            requestParam.fromRequestParamDto(createRequestParamDto);
            if (parentId) {
                requestParam.parentId = parentId;
            }
            requestParam = await this.requestParamRepo.save(requestParam);
            this.logger.log(`create request param success`);
            return requestParam;
        }
        catch (error) {
            this.logger.error(`create request param have error: ${error}`);
            return null;
        }
    }
    async createRequestParamList(createRequestParamDtoList, mappingApiId, parentId) {
        const resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`create request param list`);
            for (let i = 0; i < createRequestParamDtoList.length; i++) {
                createRequestParamDtoList[i].mappingApiId = mappingApiId;
                const requestParam = await this.createRequestParam(createRequestParamDtoList[i], parentId);
                if (createRequestParamDtoList[i].children) {
                    await this.createRequestParamList(createRequestParamDtoList[i].children, mappingApiId, requestParam.id);
                }
            }
            this.logger.log(`create request param list success`);
            return resData;
        }
        catch (error) {
            this.logger.error(`create request param list have error: ${error}`);
            resData.appData = null;
            resData.hasError = true;
            resData.message = 'Has something error when handle.';
            return resData;
        }
    }
    async findAllByMappingApiId(mappingApiId) {
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
                createRequestParam = new create_request_param_dto_1.CreateRequestParamDto();
                if (requestParams[i].parentId) {
                    const requestParam = this.findElementById(requestParamsResponse, requestParams[i].parentId);
                    requestParam.children.push(createRequestParam.fromRequestParam(requestParams[i]));
                }
                else {
                    requestParamsResponse.push(createRequestParam.fromRequestParam(requestParams[i]));
                }
            }
            return requestParamsResponse;
        }
        catch (error) {
            this.logger.error(`find all by mapping api id ${mappingApiId} have error: ${error}`);
            return null;
        }
    }
    async findOne(id) {
        const resData = new response_data_1.ResponseData();
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
            return resData;
        }
        catch (error) {
            this.logger.error(`find one by ${id} have error: ${error}`);
            resData.appData = null;
            resData.hasError = true;
            resData.message = 'Has something error when handle.';
            return resData;
        }
    }
    async removeByMappingApiId(mappingApiId) {
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
        }
        catch (error) {
            this.logger.log(`remove by mapping api id ${mappingApiId} have error: ${error}`);
        }
    }
    detect(createRequestParamDtoList) {
        for (let i = 0; i < createRequestParamDtoList.length; i++) {
            if ((createRequestParamDtoList[i].paramChange === '' &&
                createRequestParamDtoList[i].paramDefault === '') ||
                (createRequestParamDtoList[i].paramChange === '' &&
                    createRequestParamDtoList[i].paramDefault === null) ||
                (createRequestParamDtoList[i].paramChange === null &&
                    createRequestParamDtoList[i].paramDefault === '') ||
                (createRequestParamDtoList[i].paramChange === null &&
                    createRequestParamDtoList[i].paramDefault === null) ||
                createRequestParamDtoList[i].type.length < 1) {
                return false;
            }
            else {
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
    detectType(requestParam) {
        const arr = requestParam.type.map((element) => {
            return element.toLowerCase();
        });
        if (!this.checkIncluded(constant_1.TYPE_DATA, arr)) {
            return false;
        }
        if ((!this.checkIncluded(arr, ['object']) &&
            requestParam.children.length > 0) ||
            (!this.checkIncluded(arr, ['array']) && requestParam.type.length > 1)) {
            return false;
        }
        requestParam.type = arr;
        return true;
    }
    checkIncluded(myArray, checkingArray) {
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
    findElementById(requestParams, id) {
        for (let i = 0; i < requestParams.length; i++) {
            if (requestParams[i].id === id) {
                return requestParams[i];
            }
            if (requestParams[i].children) {
                const requestParam = this.findElementById(requestParams[i].children, id);
                if (requestParam) {
                    return requestParam;
                }
            }
        }
        return null;
    }
};
RequestParamService = RequestParamService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(request_param_entity_1.RequestParam)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RequestParamService);
exports.RequestParamService = RequestParamService;
//# sourceMappingURL=request-param.service.js.map