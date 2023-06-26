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
var SesameController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SesameController = void 0;
const common_1 = require("@nestjs/common");
const response_1 = require("../../common/helper/response");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const sesame_dto_1 = require("./dto/sesame.dto");
const sesame_service_1 = require("./sesame.service");
let SesameController = SesameController_1 = class SesameController {
    constructor(sesameService) {
        this.sesameService = sesameService;
        this.logger = new common_1.Logger(SesameController_1.name);
    }
    async activeLock(req, sesameDto, res) {
        const token = req.headers.authorization.replace('Bearer ', '');
        const result = await this.sesameService.toggleLock(sesameDto, token);
        (0, response_1.responseOk)(res, result);
    }
    async getLockHistory(id, res) {
        const result = await this.sesameService.getLockHistory(id);
        (0, response_1.responseOk)(res, result);
    }
    async getLockStatus(id, res) {
        this.logger.log(`[lock id]: ${id}`);
        const result = await this.sesameService.getLockStatus(id);
        (0, response_1.responseOk)(res, result);
    }
    async createLockCode(sesameLockCodeDto, res) {
        const result = await this.sesameService.createLockCode(sesameLockCodeDto);
        (0, response_1.responseOk)(res, result);
    }
    async updateLockCode(sesameLockCodeDto, res) {
        const result = await this.sesameService.updateLockCode(sesameLockCodeDto);
        (0, response_1.responseOk)(res, result);
    }
    async deleteLockCode(id, res) {
        const result = await this.sesameService.deleteLockCode(id);
        (0, response_1.responseOk)(res, result);
    }
    async getAllLockCodes(res) {
        const result = await this.sesameService.getLockCode();
        (0, response_1.responseOk)(res, result);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('active'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, sesame_dto_1.SesameDto, Object]),
    __metadata("design:returntype", Promise)
], SesameController.prototype, "activeLock", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('history/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SesameController.prototype, "getLockHistory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('status/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SesameController.prototype, "getLockStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('code'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sesame_dto_1.SesameLockCodeDto, Object]),
    __metadata("design:returntype", Promise)
], SesameController.prototype, "createLockCode", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('code'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sesame_dto_1.SesameLockCodeDto, Object]),
    __metadata("design:returntype", Promise)
], SesameController.prototype, "updateLockCode", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('code/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SesameController.prototype, "deleteLockCode", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('code'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SesameController.prototype, "getAllLockCodes", null);
SesameController = SesameController_1 = __decorate([
    (0, common_1.Controller)('sesame'),
    __metadata("design:paramtypes", [sesame_service_1.SesameService])
], SesameController);
exports.SesameController = SesameController;
//# sourceMappingURL=sesame.controller.js.map