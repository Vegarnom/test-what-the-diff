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
var ResponseCodeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseCodeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const response_data_1 = require("../../common/params/response.data");
const typeorm_2 = require("typeorm");
const mapping_api_service_1 = require("../mapping-api/mapping-api.service");
const response_code_entity_1 = require("./entities/response-code.entity");
let ResponseCodeService = ResponseCodeService_1 = class ResponseCodeService {
    constructor(responseCodeRepo, mappingApiService) {
        this.responseCodeRepo = responseCodeRepo;
        this.mappingApiService = mappingApiService;
        this.logger = new common_1.Logger(ResponseCodeService_1.name);
    }
    async findAllMappingApiId(mappingApiId) {
        const resData = new response_data_1.ResponseData();
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
        }
        catch (error) {
            this.logger.error(`find all have error: ${error}`);
            resData.appData = null;
            resData.message = 'Something error when get';
            resData.hasError = true;
            return resData;
        }
    }
    async update(listResponseCode) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log('check validate list response code');
            if (!this.checkValidate(listResponseCode)) {
                this.logger.log('list response code not validate');
                resData.message = 'Please check list response code';
                resData.hasError = true;
                return resData;
            }
            this.logger.log(`Update response code for mapping api id ${listResponseCode[0].mappingApiId}`);
            this.logger.log('check mapping api id');
            resData = await this.mappingApiService.findOne(listResponseCode[0].mappingApiId);
            if (resData.hasError) {
                return resData;
            }
            const updateResponseCodes = new Array();
            let responseCode;
            for (let i = 0; i < listResponseCode.length; i++) {
                responseCode = new response_code_entity_1.ResponseCode();
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
        }
        catch (error) {
            this.logger.error(`update have error: ${error}`);
            resData.appData = null;
            resData.message = 'Something error when update';
            resData.hasError = true;
            return resData;
        }
    }
    checkValidate(listResponseCode) {
        if (listResponseCode && listResponseCode.length > 0) {
            for (let i = 0; i < listResponseCode.length; i++) {
                if (listResponseCode[i].codeDefault === null || listResponseCode[i].codeChange === null ||
                    listResponseCode[i].codeDefault === '' || listResponseCode[i].codeChange === '' ||
                    listResponseCode[i].mappingApiId === null) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
};
ResponseCodeService = ResponseCodeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(response_code_entity_1.ResponseCode)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => mapping_api_service_1.MappingApiService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mapping_api_service_1.MappingApiService])
], ResponseCodeService);
exports.ResponseCodeService = ResponseCodeService;
//# sourceMappingURL=response-code.service.js.map