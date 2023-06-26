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
var TypeDeviceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeDeviceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const response_data_1 = require("../../common/params/response.data");
const typeorm_2 = require("typeorm");
const type_brand_device_service_1 = require("../type-brand-device/type-brand-device.service");
const type_device_entity_1 = require("./entities/type-device.entity");
let TypeDeviceService = TypeDeviceService_1 = class TypeDeviceService {
    constructor(typeDeviceRespo, typeBrandDeviceService) {
        this.typeDeviceRespo = typeDeviceRespo;
        this.typeBrandDeviceService = typeBrandDeviceService;
        this.logger = new common_1.Logger(TypeDeviceService_1.name);
    }
    async create(createTypeDeviceDto) {
        const resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`create type device ${JSON.stringify(createTypeDeviceDto)}`);
            if (createTypeDeviceDto.name.trim() === ``) {
                resData.message = 'Type name is not validate';
                this.logger.log(`Type name ${createTypeDeviceDto.name} is not validate`);
                resData.hasError = true;
                return resData;
            }
            let typeDevice = await this.typeDeviceRespo.findOne({
                where: {
                    name: createTypeDeviceDto.name,
                    isDeleted: false,
                },
            });
            if (typeDevice === null) {
                typeDevice = await this.typeDeviceRespo.save(createTypeDeviceDto);
                resData.appData = typeDevice;
                resData.message = 'Create type device success';
                this.logger.log(`create type device success`);
                return resData;
            }
            resData.message = 'Type name is exist';
            this.logger.log(`type name ${createTypeDeviceDto.name} is exist`);
            resData.hasError = true;
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
            this.logger.log(`find all type device`);
            const typeDeviceList = await this.typeDeviceRespo.find({
                where: {
                    isDeleted: false,
                },
            });
            resData.appData = typeDeviceList;
            resData.message = 'Get type device list success';
            this.logger.log(`find all type device success`);
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
                resData.message = 'Type device id is not validate';
                this.logger.log(`type device id ${id} is not validate`);
                return resData;
            }
            const typeDevice = await this.typeDeviceRespo.findOne({
                where: {
                    isDeleted: false,
                    id,
                },
            });
            if (typeDevice === null) {
                resData.hasError = true;
                resData.message = 'type device is not exist';
                this.logger.log(`type device id ${id} is not exist`);
                return resData;
            }
            resData.appData = typeDevice;
            resData.message = 'Get type device success';
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
    async update(id, updateTypeDeviceDto) {
        let resData = new response_data_1.ResponseData();
        try {
            this.logger.log(`update by id ${id}`);
            resData = await this.findOne(id);
            if (resData.hasError) {
                return resData;
            }
            if (updateTypeDeviceDto.name.trim() === ``) {
                resData.message = 'Type name is not validate';
                this.logger.log(`type name ${updateTypeDeviceDto.name} is not validate`);
                resData.hasError = true;
                resData.appData = null;
                return resData;
            }
            let typeDevice = resData.appData;
            if (typeDevice.name === updateTypeDeviceDto.name) {
                typeDevice = await this.typeDeviceRespo.save(updateTypeDeviceDto);
                resData.appData = typeDevice;
                resData.message = 'Update type device success';
                this.logger.log(`update by id ${id} success`);
                return resData;
            }
            else {
                typeDevice = await this.typeDeviceRespo.findOne({
                    where: {
                        name: updateTypeDeviceDto.name,
                        isDeleted: false,
                    },
                });
                if (typeDevice === null) {
                    typeDevice = await this.typeDeviceRespo.save(updateTypeDeviceDto);
                    resData.appData = typeDevice;
                    resData.message = 'Update type device success';
                    this.logger.log(`update by id ${id} success`);
                    return resData;
                }
                else {
                    resData.appData = null;
                    resData.message = 'Type name is exist';
                    this.logger.log(`type name ${updateTypeDeviceDto.name} is exist`);
                    resData.hasError = true;
                    return resData;
                }
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
            this.logger.log(`remove by id ${id}`);
            resData = await this.findOne(id);
            if (resData.hasError) {
                return resData;
            }
            const typeDevice = resData.appData;
            typeDevice.setIsDelete(true);
            await this.typeDeviceRespo.save(typeDevice);
            await this.typeBrandDeviceService.removeAllByTypeId(id);
            resData.appData = null;
            resData.message = 'Delete type device success';
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
};
TypeDeviceService = TypeDeviceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(type_device_entity_1.TypeDevice)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => type_brand_device_service_1.TypeBrandDeviceService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        type_brand_device_service_1.TypeBrandDeviceService])
], TypeDeviceService);
exports.TypeDeviceService = TypeDeviceService;
//# sourceMappingURL=type-device.service.js.map