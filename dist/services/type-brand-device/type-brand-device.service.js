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
var TypeBrandDeviceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeBrandDeviceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const response_data_1 = require("../../common/params/response.data");
const typeorm_2 = require("typeorm");
const brand_device_service_1 = require("../brand-device/brand-device.service");
const type_device_service_1 = require("../type-device/type-device.service");
const type_brand_device_entity_1 = require("./entities/type-brand-device.entity");
const mapping_api_service_1 = require("../mapping-api/mapping-api.service");
let TypeBrandDeviceService = TypeBrandDeviceService_1 = class TypeBrandDeviceService {
    constructor(typeBrandDeviceRepo, typeDeviceService, brandDeviceService, mappingApiService) {
        this.typeBrandDeviceRepo = typeBrandDeviceRepo;
        this.typeDeviceService = typeDeviceService;
        this.brandDeviceService = brandDeviceService;
        this.mappingApiService = mappingApiService;
        this.logger = new common_1.Logger(TypeBrandDeviceService_1.name);
    }
    async create(createTypeBrandDeviceDto) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log('Create type brand device');
            this.logger.log(`Check type device id ${createTypeBrandDeviceDto.typeDeviceId}`);
            resData = await this.typeDeviceService.findOne(createTypeBrandDeviceDto.typeDeviceId);
            if (resData.hasError) {
                return resData;
            }
            this.logger.log(`Check brand device id ${createTypeBrandDeviceDto.brandDeviceId}`);
            resData = await this.brandDeviceService.findOne(createTypeBrandDeviceDto.brandDeviceId);
            if (resData.hasError) {
                return resData;
            }
            this.logger.log(`Check have key in type brand device key: ${createTypeBrandDeviceDto.key}`);
            if (createTypeBrandDeviceDto.key) {
                resData = await this.findOneByKey(createTypeBrandDeviceDto.key);
                if (!resData.hasError) {
                    resData.hasError = true;
                    resData.appData = null;
                    resData.message = "Key is exist in DB, please input another key!";
                    return resData;
                }
            }
            this.logger.log(`Check type brand device have exist`);
            let typeBrandDevice = await this.typeBrandDeviceRepo.findOne({
                where: {
                    typeDeviceId: createTypeBrandDeviceDto.typeDeviceId,
                    brandDeviceId: createTypeBrandDeviceDto.brandDeviceId,
                    isDeleted: false,
                },
            });
            if (typeBrandDevice === null) {
                typeBrandDevice = await this.typeBrandDeviceRepo.save(createTypeBrandDeviceDto);
                resData.hasError = false;
                resData.appData = typeBrandDevice;
                resData.message = 'Create type brand device success';
                this.logger.log(`Create type brand device success`);
                return resData;
            }
            resData.appData = null;
            resData.message = 'Type brand is exist, please check again!';
            resData.hasError = true;
            this.logger.log(`Type brand is exist, please check again!`);
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
            this.logger.log(`find all type brand`);
            this.logger.log(`find all type device`);
            resData = await this.typeDeviceService.findAll();
            const typeDeviceList = resData.appData;
            this.logger.log(`find all brand device with type device id`);
            for (let i = 0; i < typeDeviceList.length; i++) {
                const typeBrandDeviceList = await this.typeBrandDeviceRepo.find({
                    where: {
                        isDeleted: false,
                        typeDeviceId: typeDeviceList[i].id,
                    },
                });
                for (let j = 0; j < typeBrandDeviceList.length; j++) {
                    const brandDevice = await this.brandDeviceService.findOne(typeBrandDeviceList[j].brandDeviceId);
                    typeBrandDeviceList[j]['name'] = brandDevice.appData.name;
                }
                typeDeviceList[i]['brandDevice'] = typeBrandDeviceList;
            }
            resData.appData = typeDeviceList;
            resData.message = 'Get type brand device list success';
            this.logger.log(`Get type brand device list success`);
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
            this.logger.log(`Get type brand by id ${id}`);
            if (id < 1) {
                resData.hasError = true;
                resData.message = 'type brand device id is not validate';
                this.logger.log(`Type brand id ${id} not validate`);
                return resData;
            }
            const typeBrandDevice = await this.typeBrandDeviceRepo.findOne({
                where: {
                    id,
                    isDeleted: false,
                },
            });
            if (typeBrandDevice === null) {
                resData.hasError = true;
                resData.message = 'Id type brand device not found';
                this.logger.log(`Type brand id ${id} not found`);
                return resData;
            }
            resData.appData = typeBrandDevice;
            resData.message = 'Get type brand device success';
            this.logger.log(`Get type brand device success`);
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
    async findOneByKey(key) {
        const resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`Get type brand by key ${key}`);
            const typeBrandDevice = await this.typeBrandDeviceRepo.findOne({
                where: {
                    isDeleted: false,
                    key,
                },
            });
            if (typeBrandDevice === null) {
                resData.hasError = true;
                resData.message = 'Type brand device not found key';
                this.logger.log(`Type brand device not found key ${key}`);
                return resData;
            }
            resData.appData = typeBrandDevice;
            resData.message = 'Get type brand device success';
            this.logger.log('Get type brand device success by key');
            return resData;
        }
        catch (error) {
            this.logger.error(`find one by key ${key} have error: ${error}`);
            resData.appData = null;
            resData.hasError = true;
            resData.message = 'Has something error when handle.';
            return resData;
        }
    }
    async update(id, updateTypeBrandDeviceDto) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`Update type brand by id ${id}`);
            this.logger.log(`Update dto: ${JSON.stringify(updateTypeBrandDeviceDto)}`);
            this.logger.log(`Check have type brand id ${id}`);
            resData = await this.findOne(id);
            if (resData.hasError) {
                return resData;
            }
            this.logger.log(`Check type brand is validate`);
            const typeBrandDevice = resData.appData;
            this.logger.log(`Check have key in type brand device key: ${updateTypeBrandDeviceDto.key}`);
            if (updateTypeBrandDeviceDto.key && typeBrandDevice.key !== updateTypeBrandDeviceDto.key) {
                resData = await this.findOneByKey(updateTypeBrandDeviceDto.key);
                if (!resData.hasError) {
                    resData.hasError = true;
                    resData.appData = null;
                    resData.message = "Key is exist in DB, please input another key!";
                    return resData;
                }
            }
            if (typeBrandDevice.typeDeviceId ===
                updateTypeBrandDeviceDto.typeDeviceId &&
                typeBrandDevice.brandDeviceId === updateTypeBrandDeviceDto.brandDeviceId) {
                const typeBrandDeviceNew = await this.typeBrandDeviceRepo.save(updateTypeBrandDeviceDto);
                resData.hasError = false;
                resData.appData = typeBrandDeviceNew;
                resData.message = 'Update type brand device success';
                this.logger.log(`Update type brand device success`);
                return resData;
            }
            else {
                this.logger.log(`Check type device id ${updateTypeBrandDeviceDto.typeDeviceId}`);
                resData = await this.typeDeviceService.findOne(updateTypeBrandDeviceDto.typeDeviceId);
                if (resData.hasError) {
                    return resData;
                }
                this.logger.log(`Check brand device id ${updateTypeBrandDeviceDto.brandDeviceId}`);
                resData = await this.brandDeviceService.findOne(updateTypeBrandDeviceDto.brandDeviceId);
                if (resData.hasError) {
                    return resData;
                }
                this.logger.log(`Check type brand device have exist`);
                let typeBrandDevice = await this.typeBrandDeviceRepo.findOne({
                    where: {
                        typeDeviceId: updateTypeBrandDeviceDto.typeDeviceId,
                        brandDeviceId: updateTypeBrandDeviceDto.brandDeviceId,
                        isDeleted: false,
                    },
                });
                if (typeBrandDevice === null) {
                    delete updateTypeBrandDeviceDto['name'];
                    await this.typeBrandDeviceRepo.update({
                        id: id
                    }, updateTypeBrandDeviceDto);
                    resData.hasError = false;
                    resData.appData = typeBrandDevice;
                    resData.message = 'Update type brand device success';
                    this.logger.log(`Update type brand device success`);
                    return resData;
                }
                resData.appData = null;
                resData.message = 'Type brand is exist, please check again!';
                resData.hasError = true;
                this.logger.log(`Type brand is exist, please check again!`);
                return resData;
            }
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
            resData = await this.findOne(id);
            this.logger.log(`remove type brand device by id ${id}`);
            this.logger.log(`Check type brand device id ${id}`);
            if (resData.hasError) {
                return resData;
            }
            const typeBrandDevice = resData.appData;
            await this.mappingApiService.removeAllByTypeBrandId(id);
            typeBrandDevice.setIsDelete(true);
            await this.typeBrandDeviceRepo.save(typeBrandDevice);
            resData.message = 'Delete type brand device success';
            this.logger.log(`Delete type brand device success`);
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
    async removeAllByTypeId(typeDeviceId) {
        try {
            this.logger.log(`remove all by type device id ${typeDeviceId}`);
            const typeBrandDeviceList = await this.typeBrandDeviceRepo.find({
                where: {
                    typeDeviceId,
                    isDeleted: false,
                },
            });
            if (typeBrandDeviceList.length > 0) {
                for (let i = 0; i < typeBrandDeviceList.length; i++) {
                    typeBrandDeviceList[i].setIsDelete(true);
                    await this.mappingApiService.removeAllByTypeBrandId(typeBrandDeviceList[i].id);
                }
                await this.typeBrandDeviceRepo.save(typeBrandDeviceList);
            }
        }
        catch (error) {
            this.logger.error(`remove by all by type id ${typeDeviceId} have error: ${error}`);
        }
    }
    async removeAllByBrandId(brandDeviceId) {
        try {
            this.logger.log(`remove all by brand device id ${brandDeviceId}`);
            const typeBrandDeviceList = await this.typeBrandDeviceRepo.find({
                where: {
                    brandDeviceId,
                    isDeleted: false,
                },
            });
            if (typeBrandDeviceList.length > 0) {
                for (let i = 0; i < typeBrandDeviceList.length; i++) {
                    typeBrandDeviceList[i].setIsDelete(true);
                    await this.mappingApiService.removeAllByTypeBrandId(typeBrandDeviceList[i].id);
                }
                await this.typeBrandDeviceRepo.save(typeBrandDeviceList);
            }
        }
        catch (error) {
            this.logger.error(`remove by all by brand id ${brandDeviceId} have error: ${error}`);
        }
    }
};
TypeBrandDeviceService = TypeBrandDeviceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(type_brand_device_entity_1.TypeBrandDevice)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => type_device_service_1.TypeDeviceService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => brand_device_service_1.BrandDeviceService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => mapping_api_service_1.MappingApiService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        type_device_service_1.TypeDeviceService,
        brand_device_service_1.BrandDeviceService,
        mapping_api_service_1.MappingApiService])
], TypeBrandDeviceService);
exports.TypeBrandDeviceService = TypeBrandDeviceService;
//# sourceMappingURL=type-brand-device.service.js.map