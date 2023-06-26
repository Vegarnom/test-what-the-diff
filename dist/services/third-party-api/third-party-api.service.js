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
var ThirdPartyApiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThirdPartyApiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const constant_1 = require("../../common/helper/constant");
const functions_1 = require("../../common/helper/functions");
const response_data_1 = require("../../common/params/response.data");
const typeorm_2 = require("typeorm");
const third_party_service_1 = require("../third-party/third-party.service");
const third_party_api_entity_1 = require("./entities/third-party-api.entity");
const mapping_api_service_1 = require("../mapping-api/mapping-api.service");
let ThirdPartyApiService = ThirdPartyApiService_1 = class ThirdPartyApiService {
    constructor(thirdPartyApiRepo, thirdPartyService, mappingApiService) {
        this.thirdPartyApiRepo = thirdPartyApiRepo;
        this.thirdPartyService = thirdPartyService;
        this.mappingApiService = mappingApiService;
        this.logger = new common_1.Logger(ThirdPartyApiService_1.name);
    }
    async create(createThirdPartyApiDto) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`Create third party api ${JSON.stringify(createThirdPartyApiDto)}`);
            this.logger.log(`Check data third party api`);
            resData = await this.checkDataBeforeCreateAndUpdate(createThirdPartyApiDto);
            if (resData.hasError) {
                this.logger.log(`${resData.message}`);
                return resData;
            }
            const thirdPartyApi = await this.thirdPartyApiRepo.save(createThirdPartyApiDto);
            resData.appData = thirdPartyApi;
            resData.message = 'Create third party api success';
            this.logger.log('Create third party api success');
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
    async findAllByThirdPartyId(thirdPartyId) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`find all by third party id ${thirdPartyId}`);
            const thirdPartyApiList = await this.thirdPartyApiRepo.find({
                where: {
                    isDeleted: false,
                    thirdPartyId,
                },
            });
            for (let i = 0; i < thirdPartyApiList.length; i++) {
                resData = await this.thirdPartyService.findOne(thirdPartyApiList[i].thirdPartyId);
                thirdPartyApiList[i]['url'] = resData.appData.url;
            }
            resData.appData = thirdPartyApiList;
            resData.message = 'Get third party api list by third party id success';
            this.logger.log(`find all by third party id ${thirdPartyId} success`);
            return resData;
        }
        catch (error) {
            this.logger.error(`find all by third party id ${thirdPartyId} have error: ${error}`);
            resData.appData = null;
            resData.hasError = true;
            resData.message = 'Has something error when handle.';
            return resData;
        }
    }
    async findOne(id) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`find one by id ${id}`);
            if (id < 1) {
                resData.hasError = true;
                resData.message = 'Third party api id is not validate';
                return resData;
            }
            const thirdPartyApi = await this.thirdPartyApiRepo.findOne({
                where: {
                    isDeleted: false,
                    id,
                },
            });
            if (thirdPartyApi === null) {
                resData.hasError = true;
                resData.message = 'Id third party api not found';
                this.logger.log(`id ${id} third party api not found`);
                return resData;
            }
            resData = await this.thirdPartyService.findOne(thirdPartyApi.thirdPartyId);
            thirdPartyApi['url'] = resData.appData.url;
            thirdPartyApi['authorizationType'] = resData.appData.authorizationType;
            resData.appData = thirdPartyApi;
            resData.message = 'Get third party api success';
            this.logger.log(`Get third party by id ${id} success`);
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
    async update(id, updateThirdPartyApiDto) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`update by id ${id}`);
            resData = await this.findOne(id);
            if (resData.hasError) {
                return resData;
            }
            this.logger.log(`Check data third party api`);
            resData = await this.checkDataBeforeCreateAndUpdate(updateThirdPartyApiDto, resData.appData, true);
            if (resData.hasError) {
                this.logger.log(`${resData.message}`);
                return resData;
            }
            const thirdPartyApi = await this.thirdPartyApiRepo.save(updateThirdPartyApiDto);
            resData.appData = thirdPartyApi;
            resData.message = 'Update third party api success';
            this.logger.log(`update by id ${id} success`);
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
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`remove by id ${id}`);
            resData = await this.findOne(id);
            if (resData.hasError) {
                return resData;
            }
            const thirdPartyApi = resData.appData;
            thirdPartyApi.setIsDelete(true);
            await this.thirdPartyApiRepo.save(thirdPartyApi);
            await this.mappingApiService.removeAllByThirdPartyApiId(thirdPartyApi.id);
            resData.appData = null;
            resData.message = 'Delete third party api success';
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
    async removeAllByThirdPartyId(thirdPartyId) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`remove all by third party id ${thirdPartyId}`);
            resData = await this.findAllByThirdPartyId(thirdPartyId);
            if (resData.hasError) {
                return resData;
            }
            const thirdPartyApiList = resData.appData;
            if (thirdPartyApiList.length > 0) {
                for (let i = 0; i < thirdPartyApiList.length; i++) {
                    await this.mappingApiService.removeAllByThirdPartyApiId(thirdPartyApiList[i].id);
                    thirdPartyApiList[i].setIsDelete(true);
                }
                await this.thirdPartyApiRepo.save(thirdPartyApiList);
            }
            resData.appData = null;
            resData.message = 'Delete all by third party id success';
            this.logger.log(`remove all by third party id ${thirdPartyId} success`);
            return resData;
        }
        catch (error) {
            this.logger.error(`remove all by third party id ${thirdPartyId} have error: ${error}`);
            resData.appData = null;
            resData.hasError = true;
            resData.message = 'Has something error when handle.';
            return resData;
        }
    }
    async checkDataBeforeCreateAndUpdate(data, dataInDB, update) {
        let resData = new response_data_1.ResponseData();
        let check = (0, functions_1.checkAndRemoveSpaceInput)(data['name']);
        if (!check) {
            resData.hasError = true;
            resData.message = 'Third party api name is not validate.';
            return resData;
        }
        check = (0, functions_1.checkAndRemoveSpaceInput)(data['endpointGetParam']);
        if (!check) {
            resData.hasError = true;
            resData.message = 'Third party api endpoint get param is not validate.';
            return resData;
        }
        if (!constant_1.METHOD.includes(data['method'])) {
            resData.hasError = true;
            resData.message = 'Third party api method is not validate.';
            return resData;
        }
        resData = await this.thirdPartyService.findOne(data['thirdPartyId']);
        if (resData.hasError) {
            return resData;
        }
        if (update) {
            if (data['name'] === dataInDB['name'] && data['method'] === dataInDB['method']) {
                return resData;
            }
        }
        const thirdParty = await this.thirdPartyApiRepo.findOne({
            where: {
                name: data['name'],
                thirdPartyId: data['thirdPartyId'],
                method: data['method'],
                isDeleted: false,
            },
        });
        if (thirdParty === null) {
            return resData;
        }
        resData.hasError = true;
        resData.message = 'Third party api name is exist';
        resData.appData = null;
        return resData;
    }
};
ThirdPartyApiService = ThirdPartyApiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(third_party_api_entity_1.ThirdPartyApi)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => third_party_service_1.ThirdPartyService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => mapping_api_service_1.MappingApiService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        third_party_service_1.ThirdPartyService,
        mapping_api_service_1.MappingApiService])
], ThirdPartyApiService);
exports.ThirdPartyApiService = ThirdPartyApiService;
//# sourceMappingURL=third-party-api.service.js.map