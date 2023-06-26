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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandDeviceController = void 0;
const common_1 = require("@nestjs/common");
const brand_device_service_1 = require("./brand-device.service");
const create_brand_device_dto_1 = require("./dto/create-brand-device.dto");
const update_brand_device_dto_1 = require("./dto/update-brand-device.dto");
const response_1 = require("../../common/helper/response");
let BrandDeviceController = class BrandDeviceController {
    constructor(brandDeviceService) {
        this.brandDeviceService = brandDeviceService;
    }
    async create(createBrandDeviceDto, res) {
        return (0, response_1.responseData)(res, await this.brandDeviceService.create(createBrandDeviceDto));
    }
    async findAll(res) {
        return (0, response_1.responseData)(res, await this.brandDeviceService.findAll());
    }
    async findOne(id, res) {
        return (0, response_1.responseData)(res, await this.brandDeviceService.findOne(id));
    }
    async update(id, updateBrandDeviceDto, res) {
        return (0, response_1.responseData)(res, await this.brandDeviceService.update(id, updateBrandDeviceDto));
    }
    async remove(id, res) {
        return (0, response_1.responseData)(res, await this.brandDeviceService.remove(id));
    }
};
__decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_brand_device_dto_1.CreateBrandDeviceDto, Object]),
    __metadata("design:returntype", Promise)
], BrandDeviceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrandDeviceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BrandDeviceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_brand_device_dto_1.UpdateBrandDeviceDto, Object]),
    __metadata("design:returntype", Promise)
], BrandDeviceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BrandDeviceController.prototype, "remove", null);
BrandDeviceController = __decorate([
    (0, common_1.Controller)('brand-device'),
    __metadata("design:paramtypes", [brand_device_service_1.BrandDeviceService])
], BrandDeviceController);
exports.BrandDeviceController = BrandDeviceController;
//# sourceMappingURL=brand-device.controller.js.map