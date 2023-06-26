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
exports.ThirdPartyApiController = void 0;
const common_1 = require("@nestjs/common");
const third_party_api_service_1 = require("./third-party-api.service");
const create_third_party_api_dto_1 = require("./dto/create-third-party-api.dto");
const update_third_party_api_dto_1 = require("./dto/update-third-party-api.dto");
const response_1 = require("../../common/helper/response");
let ThirdPartyApiController = class ThirdPartyApiController {
    constructor(thirdPartyApiService) {
        this.thirdPartyApiService = thirdPartyApiService;
    }
    async create(createThirdPartyApiDto, res) {
        return (0, response_1.responseData)(res, await this.thirdPartyApiService.create(createThirdPartyApiDto));
    }
    async findAllByThirdPartyId(res, thirdPartyId) {
        return (0, response_1.responseData)(res, await this.thirdPartyApiService.findAllByThirdPartyId(thirdPartyId));
    }
    async findOne(id, res) {
        return (0, response_1.responseData)(res, await this.thirdPartyApiService.findOne(id));
    }
    async update(id, updateThirdPartyApiDto, res) {
        return (0, response_1.responseData)(res, await this.thirdPartyApiService.update(id, updateThirdPartyApiDto));
    }
    async remove(id, res) {
        return (0, response_1.responseData)(res, await this.thirdPartyApiService.remove(id));
    }
};
__decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_third_party_api_dto_1.CreateThirdPartyApiDto, Object]),
    __metadata("design:returntype", Promise)
], ThirdPartyApiController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('thirdPartyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ThirdPartyApiController.prototype, "findAllByThirdPartyId", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ThirdPartyApiController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_third_party_api_dto_1.UpdateThirdPartyApiDto, Object]),
    __metadata("design:returntype", Promise)
], ThirdPartyApiController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ThirdPartyApiController.prototype, "remove", null);
ThirdPartyApiController = __decorate([
    (0, common_1.Controller)('third-party-api'),
    __metadata("design:paramtypes", [third_party_api_service_1.ThirdPartyApiService])
], ThirdPartyApiController);
exports.ThirdPartyApiController = ThirdPartyApiController;
//# sourceMappingURL=third-party-api.controller.js.map