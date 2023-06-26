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
var TokenProviderController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenProviderController = void 0;
const common_1 = require("@nestjs/common");
const token_provider_service_1 = require("./token-provider.service");
const aws = require("@aws-sdk/client-api-gateway");
const response_1 = require("../../common/helper/response");
let TokenProviderController = TokenProviderController_1 = class TokenProviderController {
    constructor(tokenProviderService) {
        this.tokenProviderService = tokenProviderService;
        this.logger = new common_1.Logger(TokenProviderController_1.name);
    }
    async createUsagePlan(planInfo, res) {
        const result = await this.tokenProviderService.createUsagePlan(planInfo);
        (0, response_1.responseCreated)(res, result);
    }
    async getAllUsagePlans(res) {
        const result = await this.tokenProviderService.searchUsagePlans('');
        (0, response_1.responseOk)(res, result);
    }
    async updateUsagePlan(planInfo, res) {
        const result = await this.tokenProviderService.updateUsagePlan(planInfo);
        (0, response_1.responseOk)(res, result);
    }
    async physicalDeleteUsagePlan(planId, res) {
        const result = await this.tokenProviderService.deleteUsagePlan(planId);
        (0, response_1.responseOk)(res, result);
    }
    async createToken(tokenInfo, res) {
        const result = await this.tokenProviderService.createToken(tokenInfo);
        (0, response_1.responseCreated)(res, result);
    }
    async getAllTokens(res) {
        const result = await this.tokenProviderService.searchToken('');
        (0, response_1.responseOk)(res, result);
    }
    async allowUsageToken({ tokenId, status }, res) {
        const result = await this.tokenProviderService.allowUsageToken(tokenId, status);
        (0, response_1.responseOk)(res, result);
    }
    async physicalDeleteToken(tokenId, res) {
        const result = await this.tokenProviderService.deleteToken(tokenId);
        (0, response_1.responseOk)(res, result);
    }
    async mappingPlanAndToken(mappingPlan, res) {
        const result = await this.tokenProviderService.mappingUsagePlanAndToken(mappingPlan);
        (0, response_1.responseOk)(res, result);
    }
};
__decorate([
    (0, common_1.Post)('usage-plan'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TokenProviderController.prototype, "createUsagePlan", null);
__decorate([
    (0, common_1.Get)('usage-plan'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TokenProviderController.prototype, "getAllUsagePlans", null);
__decorate([
    (0, common_1.Put)('usage-plan'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TokenProviderController.prototype, "updateUsagePlan", null);
__decorate([
    (0, common_1.Delete)('usage-plan'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TokenProviderController.prototype, "physicalDeleteUsagePlan", null);
__decorate([
    (0, common_1.Post)('token'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TokenProviderController.prototype, "createToken", null);
__decorate([
    (0, common_1.Get)('token'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TokenProviderController.prototype, "getAllTokens", null);
__decorate([
    (0, common_1.Put)('token'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TokenProviderController.prototype, "allowUsageToken", null);
__decorate([
    (0, common_1.Delete)('token'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TokenProviderController.prototype, "physicalDeleteToken", null);
__decorate([
    (0, common_1.Post)('map-plan-token'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TokenProviderController.prototype, "mappingPlanAndToken", null);
TokenProviderController = TokenProviderController_1 = __decorate([
    (0, common_1.Controller)('token-provider'),
    __metadata("design:paramtypes", [token_provider_service_1.TokenProviderService])
], TokenProviderController);
exports.TokenProviderController = TokenProviderController;
//# sourceMappingURL=token-provider.controller.js.map