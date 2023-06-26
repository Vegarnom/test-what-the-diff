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
var ResponseParamService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseParamService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const constant_1 = require("../../common/helper/constant");
const response_data_1 = require("../../common/params/response.data");
const typeorm_2 = require("typeorm");
const create_response_param_dto_1 = require("./dto/create-response-param.dto");
const response_param_entity_1 = require("./entities/response-param.entity");
let ResponseParamService = ResponseParamService_1 = class ResponseParamService {
    constructor(responseParamRepo) {
        this.responseParamRepo = responseParamRepo;
        this.logger = new common_1.Logger(ResponseParamService_1.name);
    }
    async createResponseParam(createResponseParamDto, parentId) {
        try {
            this.logger.log(`create response param ${JSON.stringify(createResponseParamDto)}`);
            let responseParam = new response_param_entity_1.ResponseParam();
            responseParam.fromResponseParamDto(createResponseParamDto);
            if (parentId) {
                responseParam.parentId = parentId;
            }
            responseParam = await this.responseParamRepo.save(responseParam);
            this.logger.log(`create response param success`);
            return responseParam;
        }
        catch (error) {
            this.logger.error(`create response param have error: ${error}`);
            return null;
        }
    }
    async createResponseParamList(createResponseParamDtoList, mappingApiId, parentId) {
        const resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`create response param list`);
            for (let i = 0; i < createResponseParamDtoList.length; i++) {
                createResponseParamDtoList[i].mappingApiId = mappingApiId;
                const responseParam = await this.createResponseParam(createResponseParamDtoList[i], parentId);
                if (createResponseParamDtoList[i].children) {
                    await this.createResponseParamList(createResponseParamDtoList[i].children, mappingApiId, responseParam.id);
                }
            }
            this.logger.log(`create response param list success`);
            return resData;
        }
        catch (error) {
            this.logger.error(`create response param list have error: ${error}`);
            resData.appData = null;
            resData.hasError = true;
            resData.message = 'Has something error when handle.';
            return resData;
        }
    }
    async findAllByMappingApiId(mappingApiId) {
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
                createResponseParam = new create_response_param_dto_1.CreateResponseParamDto();
                if (responseParams[i].parentId) {
                    const responseParam = this.findElementById(responseParamsResponse, responseParams[i].parentId);
                    responseParam.children.push(createResponseParam.fromRequestParam(responseParams[i]));
                }
                else {
                    responseParamsResponse.push(createResponseParam.fromRequestParam(responseParams[i]));
                }
            }
            return responseParamsResponse;
        }
        catch (error) {
            this.logger.error(`find all by mapping api id ${mappingApiId} have error: ${error}`);
            return null;
        }
    }
    async removeByMappingApiId(mappingApiId) {
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
        }
        catch (error) {
            this.logger.log(`remove by mapping api id ${mappingApiId} have error: ${error}`);
        }
    }
    detect(createResponseParamDtoList) {
        for (let i = 0; i < createResponseParamDtoList.length; i++) {
            if ((createResponseParamDtoList[i].paramChange == '' &&
                createResponseParamDtoList[i].paramDefault == '') ||
                (createResponseParamDtoList[i].paramChange == '' &&
                    createResponseParamDtoList[i].paramDefault == null) ||
                (createResponseParamDtoList[i].paramChange == null &&
                    createResponseParamDtoList[i].paramDefault == '') ||
                (createResponseParamDtoList[i].paramChange == null &&
                    createResponseParamDtoList[i].paramDefault == null) ||
                createResponseParamDtoList[i].type.length < 1) {
                return false;
            }
            else {
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
    detectType(responseParam) {
        const arr = responseParam.type.map((element) => {
            return element.toLowerCase();
        });
        if (!this.checkIncluded(constant_1.TYPE_DATA, arr)) {
            return false;
        }
        if ((!this.checkIncluded(arr, ['object']) &&
            responseParam.children.length > 0) ||
            ((!this.checkIncluded(arr, ['array']) && responseParam.type.length > 1) &&
                (!this.checkIncluded(arr, ['response_code']) && responseParam.type.length > 1))) {
            return false;
        }
        responseParam.type = arr;
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
    findElementById(responseParams, id) {
        for (let i = 0; i < responseParams.length; i++) {
            if (responseParams[i].id == id) {
                return responseParams[i];
            }
            if (responseParams[i].children) {
                const responseParam = this.findElementById(responseParams[i].children, id);
                if (responseParam) {
                    return responseParam;
                }
            }
        }
        return null;
    }
};
ResponseParamService = ResponseParamService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(response_param_entity_1.ResponseParam)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ResponseParamService);
exports.ResponseParamService = ResponseParamService;
//# sourceMappingURL=response-param.service.js.map