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
var AuthorizationKioskController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationKioskController = void 0;
const common_1 = require("@nestjs/common");
const authorization_service_1 = require("./authorization.service");
const authorization_kiosk_dto_1 = require("./dto/authorization-kiosk.dto");
const authorization_kiosk_pms_dto_1 = require("./dto/authorization-kiosk-pms.dto");
const get_authorization_kiosk_pms_dto_1 = require("./dto/get-authorization-kiosk-pms.dto");
const response_1 = require("../../common/helper/response");
let AuthorizationKioskController = AuthorizationKioskController_1 = class AuthorizationKioskController {
    constructor(authorizationKioskService) {
        this.authorizationKioskService = authorizationKioskService;
        this.logger = new common_1.Logger(AuthorizationKioskController_1.name);
    }
    async findAll(res) {
        const result = await this.authorizationKioskService.findAll();
        return (0, response_1.responseData)(res, result);
    }
    async getApiKey(apiKey, res) {
        const result = await this.authorizationKioskService.getApiKey(apiKey);
        return (0, response_1.responseData)(res, result);
    }
    async getAuthByOrgId(getAuthorizationKioskPMSDto, res) {
        const result = await this.authorizationKioskService.getAuthByOrgId(getAuthorizationKioskPMSDto);
        return (0, response_1.responseData)(res, result);
    }
    async createFromPMS(authorizationKioskPMSDto, res) {
        const result = await this.authorizationKioskService.createFromPMS(authorizationKioskPMSDto);
        return (0, response_1.responseData)(res, result);
    }
    async create(authorizationKioskDto, res) {
        const result = await this.authorizationKioskService.create(authorizationKioskDto);
        return (0, response_1.responseData)(res, result);
    }
    async resetApiKey(id, res) {
        const result = await this.authorizationKioskService.resetApiKey(id);
        return (0, response_1.responseData)(res, result);
    }
    async update(authorizationKioskDto, res) {
        const result = await this.authorizationKioskService.update(authorizationKioskDto);
        return (0, response_1.responseData)(res, result);
    }
    async delete(id, res) {
        const result = await this.authorizationKioskService.remove(id);
        return (0, response_1.responseData)(res, result);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthorizationKioskController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('api-key/:apiKey'),
    __param(0, (0, common_1.Param)('apiKey')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthorizationKioskController.prototype, "getApiKey", null);
__decorate([
    (0, common_1.Post)('pms/orgId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_authorization_kiosk_pms_dto_1.GetAuthorizationKioskPMSDto, Object]),
    __metadata("design:returntype", Promise)
], AuthorizationKioskController.prototype, "getAuthByOrgId", null);
__decorate([
    (0, common_1.Post)('pms'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [authorization_kiosk_pms_dto_1.AuthorizationKioskPMSDto, Object]),
    __metadata("design:returntype", Promise)
], AuthorizationKioskController.prototype, "createFromPMS", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [authorization_kiosk_dto_1.AuthorizationKioskDto, Object]),
    __metadata("design:returntype", Promise)
], AuthorizationKioskController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('reset-token/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AuthorizationKioskController.prototype, "resetApiKey", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [authorization_kiosk_dto_1.AuthorizationKioskDto, Object]),
    __metadata("design:returntype", Promise)
], AuthorizationKioskController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AuthorizationKioskController.prototype, "delete", null);
AuthorizationKioskController = AuthorizationKioskController_1 = __decorate([
    (0, common_1.Controller)('authorization-kiosk'),
    __metadata("design:paramtypes", [authorization_service_1.AuthorizationKioskService])
], AuthorizationKioskController);
exports.AuthorizationKioskController = AuthorizationKioskController;
//# sourceMappingURL=authorization.controller.js.map