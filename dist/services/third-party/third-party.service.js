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
var ThirdPartyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThirdPartyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const functions_1 = require("../../common/helper/functions");
const response_data_1 = require("../../common/params/response.data");
const typeorm_2 = require("typeorm");
const third_party_api_service_1 = require("../third-party-api/third-party-api.service");
const third_party_entity_1 = require("./entities/third-party.entity");
const authorization_service_1 = require("../authorization-kiosk/authorization.service");
const constant_1 = require("../../common/helper/constant");
let ThirdPartyService = ThirdPartyService_1 = class ThirdPartyService {
    constructor(thirdPartyRepo, thirdPartyApiService, authorizationKioksService) {
        this.thirdPartyRepo = thirdPartyRepo;
        this.thirdPartyApiService = thirdPartyApiService;
        this.authorizationKioksService = authorizationKioksService;
        this.logger = new common_1.Logger(ThirdPartyService_1.name);
    }
    async create(createThirdPartyDto) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`Create third party ${JSON.stringify(createThirdPartyDto)}`);
            this.logger.log(`Check data third party`);
            resData = await this.checkDataBeforeCreateAndUpdate(createThirdPartyDto);
            if (resData.hasError) {
                this.logger.log(`${resData.message}`);
                return resData;
            }
            const thirdParty = await this.thirdPartyRepo.save(createThirdPartyDto);
            resData.appData = thirdParty;
            resData.message = 'Create third party success';
            this.logger.log(`Create third party success`);
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
    async findAll() {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log('find all third party');
            const thirdPartyList = await this.thirdPartyRepo.find({
                where: {
                    isDeleted: false,
                },
            });
            for (let i = 0; i < thirdPartyList.length; i++) {
                resData = await this.thirdPartyApiService.findAllByThirdPartyId(thirdPartyList[i].id);
                thirdPartyList[i]['thirdPartyApiList'] = resData.appData;
            }
            resData.appData = thirdPartyList;
            resData.message = 'Get third party list success';
            this.logger.log('find all third party success');
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
            this.logger.log(`find one by third party id ${id}`);
            if (id < 1) {
                resData.hasError = true;
                resData.message = 'Third party id is not validate';
                this.logger.log(`third party id ${id} is not validate`);
                return resData;
            }
            const thirdParty = await this.thirdPartyRepo.findOne({
                where: {
                    isDeleted: false,
                    id,
                },
            });
            if (thirdParty === null) {
                resData.hasError = true;
                resData.message = 'Third party id not found';
                this.logger.log(`third party id ${id} not found`);
                return resData;
            }
            resData.appData = thirdParty;
            resData.message = 'Get third party success';
            this.logger.log(`find one by third party id ${id} success`);
            return resData;
        }
        catch (error) {
            this.logger.error(`find one have error: ${error}`);
            resData.appData = null;
            resData.hasError = true;
            resData.message = 'Has something error when handle.';
            return resData;
        }
    }
    async findOneByAuthorizationType(authorizationType) {
        const resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`find by AuthorizationType`);
            const thirdParty = await this.thirdPartyRepo.findOne({
                where: {
                    isDeleted: false,
                    authorizationType: authorizationType,
                },
            });
            if (thirdParty === null) {
                resData.hasError = true;
                resData.message = 'Third party not found';
                this.logger.log(`third party not found`);
                return resData;
            }
            resData.appData = thirdParty;
            resData.message = 'Get third party success';
            this.logger.log(`find by authorizationType third party success`);
            return resData;
        }
        catch (error) {
            this.logger.error(`find one have error: ${error}`);
            resData.appData = null;
            resData.hasError = true;
            resData.message = 'Has something error when handle.';
            return resData;
        }
    }
    async update(id, updateThirdPartyDto) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`Update third party id ${updateThirdPartyDto.id}`);
            resData = await this.findOne(id);
            if (resData.hasError) {
                return resData;
            }
            this.logger.log(`Check data third party`);
            resData = await this.checkDataBeforeCreateAndUpdate(updateThirdPartyDto, resData.appData, true);
            if (resData.hasError) {
                this.logger.log(`${resData.message}`);
                return resData;
            }
            const thirdParty = await this.thirdPartyRepo.save(updateThirdPartyDto);
            resData.appData = thirdParty;
            resData.message = 'Update third party success';
            this.logger.log('Update third party success');
            return resData;
        }
        catch (error) {
            this.logger.error(`update third party have error: ${error}`);
            resData.appData = null;
            resData.hasError = true;
            resData.message = 'Has something error when handle.';
            return resData;
        }
    }
    async remove(id) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`remove third party id ${id}`);
            resData = await this.findOne(id);
            if (resData.hasError) {
                return resData;
            }
            const thirdParty = resData.appData;
            resData = await this.authorizationKioksService.findAllByThirdPartyId(id);
            if (resData.appData.length > 0) {
                resData.appData = null;
                resData.hasError = true;
                resData.message = 'Please remove authorization kiosk relate to this third party';
                return resData;
            }
            await this.thirdPartyApiService.removeAllByThirdPartyId(id);
            thirdParty.setIsDelete(true);
            await this.thirdPartyRepo.save(thirdParty);
            resData.appData = null;
            resData.message = 'Delete third party success';
            this.logger.log(`remove third party id ${id} success`);
            return resData;
        }
        catch (error) {
            this.logger.error(`remove third party have error: ${error}`);
            resData.appData = null;
            resData.hasError = true;
            resData.message = 'Has something error when handle.';
            return resData;
        }
    }
    async checkDataBeforeCreateAndUpdate(data, dataInDB, update) {
        let resData = new response_data_1.ResponseData();
        let check = constant_1.authorizationType.includes(data['authorizationType']);
        if (!check) {
            resData.hasError = true;
            resData.message = 'Authorization type is not valid';
            return resData;
        }
        check = (0, functions_1.checkAndRemoveSpaceInput)(data['name']);
        if (!check) {
            resData.hasError = true;
            resData.message = 'Third party name is not validate.';
            return resData;
        }
        check = (0, functions_1.checkAndRemoveSpaceInput)(data['url']);
        if (!check) {
            resData.hasError = true;
            resData.message = 'Third party url is not validate.';
            return resData;
        }
        if (update) {
            if (data['authorizationType'] !== dataInDB['authorizationType']) {
                resData = await this.authorizationKioksService.findAllByThirdPartyId(data['id']);
                if (resData.hasError) {
                    return resData;
                }
                if (resData.appData.length > 0) {
                    resData.hasError = true;
                    resData.message = 'Please remove all authorization kiosk of this third party to change authorization type!';
                    resData.appData = null;
                    return resData;
                }
            }
            if (data['name'] === dataInDB['name']) {
                return resData;
            }
        }
        const thirdParty = await this.thirdPartyRepo.findOne({
            where: {
                name: data['name'],
                isDeleted: false,
            },
        });
        if (thirdParty === null) {
            return resData;
        }
        resData.hasError = true;
        resData.message = 'Third party name is exist';
        return resData;
    }
};
ThirdPartyService = ThirdPartyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(third_party_entity_1.ThirdParty)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => third_party_api_service_1.ThirdPartyApiService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => authorization_service_1.AuthorizationKioskService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        third_party_api_service_1.ThirdPartyApiService,
        authorization_service_1.AuthorizationKioskService])
], ThirdPartyService);
exports.ThirdPartyService = ThirdPartyService;
//# sourceMappingURL=third-party.service.js.map