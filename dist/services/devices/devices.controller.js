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
var DevicesController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const devices_service_1 = require("./devices.service");
const devices_dto_1 = require("./dto/devices.dto");
const response_1 = require("../../common/helper/response");
let DevicesController = DevicesController_1 = class DevicesController {
    constructor(devicesService) {
        this.devicesService = devicesService;
        this.logger = new common_1.Logger(DevicesController_1.name);
    }
    async createDevice(req, devicesDto, res) {
        const token = req.headers.authorization.replace('Bearer ', '');
        const result = await this.devicesService.createDevice(devicesDto, token);
        (0, response_1.responseCreated)(res, result);
    }
    async updateDevice(devicesDto, res) {
        const result = await this.devicesService.updateDevice(devicesDto);
        (0, response_1.responseOk)(res, result);
    }
    async getAllDevicesByUser(req, res) {
        const token = req.headers.authorization.replace('Bearer ', '');
        const result = await this.devicesService.getAllDevicesByUser(token);
        (0, response_1.responseOk)(res, result);
    }
    async getAllDevices(res) {
        const result = await this.devicesService.getAllDevices();
        (0, response_1.responseOk)(res, result);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, devices_dto_1.DevicesDto, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "createDevice", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [devices_dto_1.DevicesDto, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateDevice", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('user'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getAllDevicesByUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('all'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getAllDevices", null);
DevicesController = DevicesController_1 = __decorate([
    (0, common_1.Controller)('devices'),
    __metadata("design:paramtypes", [devices_service_1.DevicesService])
], DevicesController);
exports.DevicesController = DevicesController;
//# sourceMappingURL=devices.controller.js.map