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
exports.TypeDeviceController = void 0;
const common_1 = require("@nestjs/common");
const type_device_service_1 = require("./type-device.service");
const create_type_device_dto_1 = require("./dto/create-type-device.dto");
const update_type_device_dto_1 = require("./dto/update-type-device.dto");
const response_1 = require("../../common/helper/response");
let TypeDeviceController = class TypeDeviceController {
    constructor(typeDeviceService) {
        this.typeDeviceService = typeDeviceService;
    }
    async create(createTypeDeviceDto, res) {
        return (0, response_1.responseData)(res, await this.typeDeviceService.create(createTypeDeviceDto));
    }
    async findAll(res) {
        return (0, response_1.responseData)(res, await this.typeDeviceService.findAll());
    }
    async findOne(id, res) {
        return (0, response_1.responseData)(res, await this.typeDeviceService.findOne(id));
    }
    async update(id, updateTypeDeviceDto, res) {
        return (0, response_1.responseData)(res, await this.typeDeviceService.update(id, updateTypeDeviceDto));
    }
    async remove(id, res) {
        return (0, response_1.responseData)(res, await this.typeDeviceService.remove(id));
    }
};
__decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_type_device_dto_1.CreateTypeDeviceDto, Object]),
    __metadata("design:returntype", Promise)
], TypeDeviceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TypeDeviceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TypeDeviceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_type_device_dto_1.UpdateTypeDeviceDto, Object]),
    __metadata("design:returntype", Promise)
], TypeDeviceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TypeDeviceController.prototype, "remove", null);
TypeDeviceController = __decorate([
    (0, common_1.Controller)('type-device'),
    __metadata("design:paramtypes", [type_device_service_1.TypeDeviceService])
], TypeDeviceController);
exports.TypeDeviceController = TypeDeviceController;
//# sourceMappingURL=type-device.controller.js.map