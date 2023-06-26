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
var BrandDeviceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandDeviceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const response_data_1 = require("../../common/params/response.data");
const typeorm_2 = require("typeorm");
const type_brand_device_service_1 = require("../type-brand-device/type-brand-device.service");
const brand_device_entity_1 = require("./entities/brand-device.entity");
let BrandDeviceService = BrandDeviceService_1 = class BrandDeviceService {
    constructor(brandDeviceRespo, typeBrandDeviceService) {
        this.brandDeviceRespo = brandDeviceRespo;
        this.typeBrandDeviceService = typeBrandDeviceService;
        this.logger = new common_1.Logger(BrandDeviceService_1.name);
    }
    async create(createBrandDeviceDto) {
        const resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`create brand device ${JSON.stringify(createBrandDeviceDto)}`);
            if (createBrandDeviceDto.name.trim() === ``) {
                this.logger.log(`brand name ${createBrandDeviceDto.name} is not validate`);
                resData.message = 'Brand name is not validate';
                resData.hasError = true;
                return resData;
            }
            let brandDevice = await this.brandDeviceRespo.findOne({
                where: {
                    name: createBrandDeviceDto.name,
                    isDeleted: false,
                },
            });
            if (brandDevice === null) {
                brandDevice = await this.brandDeviceRespo.save(createBrandDeviceDto);
                resData.appData = brandDevice;
                resData.message = 'create brand device success';
                this.logger.log(`create brand device success`);
                return resData;
            }
            resData.hasError = true;
            resData.message = 'Name brand is exist in db';
            this.logger.log(`brand name ${createBrandDeviceDto.name} is exist`);
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
        const resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`find all brand device`);
            const brandDeviceList = await this.brandDeviceRespo.find({
                where: {
                    isDeleted: false,
                },
            });
            resData.appData = brandDeviceList;
            resData.message = 'Get brand device list success';
            this.logger.log(`find all success`);
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
                resData.message = 'Brand device id is not validate';
                this.logger.log(`brand device id ${id} is not validate`);
                return resData;
            }
            const brandDevice = await this.brandDeviceRespo.findOne({
                where: {
                    isDeleted: false,
                    id,
                },
            });
            if (brandDevice === null) {
                resData.hasError = true;
                resData.message = 'Brand device id not found';
                this.logger.log(`brand device id ${id} not found`);
                return resData;
            }
            resData.appData = brandDevice;
            resData.message = 'Get brand device success';
            this.logger.log(`find one by id ${id} success`);
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
    async update(id, updateBrandDeviceDto) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`update by id ${id}`);
            resData = await this.findOne(id);
            if (resData.hasError) {
                return resData;
            }
            if (updateBrandDeviceDto.name.trim() === ``) {
                resData.message = 'Brand name is not validate';
                this.logger.log(`brand name ${updateBrandDeviceDto.name} is not validate`);
                resData.hasError = true;
                resData.appData = null;
                return resData;
            }
            let brandDevice = resData.appData;
            if (brandDevice.name === updateBrandDeviceDto.name) {
                brandDevice = await this.brandDeviceRespo.save(updateBrandDeviceDto);
                resData.appData = brandDevice;
                resData.message = 'update brand device success';
                this.logger.log(`update by ${id} success`);
                return resData;
            }
            else {
                brandDevice = await this.brandDeviceRespo.findOne({
                    where: {
                        name: updateBrandDeviceDto.name,
                        isDeleted: false,
                    },
                });
                if (brandDevice === null) {
                    brandDevice = await this.brandDeviceRespo.save(updateBrandDeviceDto);
                    resData.appData = brandDevice;
                    resData.message = 'update brand device success';
                    this.logger.log(`update by ${id} success`);
                    return resData;
                }
                else {
                    resData.appData = null;
                    resData.message = 'Brand name is exist';
                    this.logger.log(`brand name ${updateBrandDeviceDto.name} is exist`);
                    resData.hasError = true;
                    return resData;
                }
            }
        }
        catch (error) {
            this.logger.error(`update by ${id} have error: ${error}`);
            resData.appData = null;
            resData.hasError = true;
            resData.message = 'Has something error when handle.';
            return resData;
        }
    }
    async remove(id) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`remove by ${id}`);
            resData = await this.findOne(id);
            if (resData.hasError) {
                return resData;
            }
            const brandDevice = resData.appData;
            brandDevice.setIsDelete(true);
            await this.brandDeviceRespo.save(brandDevice);
            await this.typeBrandDeviceService.removeAllByBrandId(id);
            resData.appData = null;
            resData.message = 'delete brand device success';
            this.logger.log(`remove by ${id} success`);
            return resData;
        }
        catch (error) {
            this.logger.error(`remove by ${id} have error: ${error}`);
            resData.appData = null;
            resData.hasError = true;
            resData.message = 'Has something error when handle.';
            return resData;
        }
    }
};
BrandDeviceService = BrandDeviceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(brand_device_entity_1.BrandDevice)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => type_brand_device_service_1.TypeBrandDeviceService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        type_brand_device_service_1.TypeBrandDeviceService])
], BrandDeviceService);
exports.BrandDeviceService = BrandDeviceService;
//# sourceMappingURL=brand-device.service.js.map