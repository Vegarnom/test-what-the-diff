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
exports.ThirdPartyController = void 0;
const common_1 = require("@nestjs/common");
const third_party_service_1 = require("./third-party.service");
const create_third_party_dto_1 = require("./dto/create-third-party.dto");
const update_third_party_dto_1 = require("./dto/update-third-party.dto");
const response_1 = require("../../common/helper/response");
let ThirdPartyController = class ThirdPartyController {
    constructor(thirdPartyService) {
        this.thirdPartyService = thirdPartyService;
    }
    async create(createThirdPartyDto, res) {
        return (0, response_1.responseData)(res, await this.thirdPartyService.create(createThirdPartyDto));
    }
    async findAll(res) {
        return (0, response_1.responseData)(res, await this.thirdPartyService.findAll());
    }
    async findOne(id, res) {
        return (0, response_1.responseData)(res, await this.thirdPartyService.findOne(id));
    }
    async update(id, updateThirdPartyDto, res) {
        return (0, response_1.responseData)(res, await this.thirdPartyService.update(id, updateThirdPartyDto));
    }
    async remove(id, res) {
        return (0, response_1.responseData)(res, await this.thirdPartyService.remove(id));
    }
};
__decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_third_party_dto_1.CreateThirdPartyDto, Object]),
    __metadata("design:returntype", Promise)
], ThirdPartyController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ThirdPartyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ThirdPartyController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_third_party_dto_1.UpdateThirdPartyDto, Object]),
    __metadata("design:returntype", Promise)
], ThirdPartyController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ThirdPartyController.prototype, "remove", null);
ThirdPartyController = __decorate([
    (0, common_1.Controller)('third-party'),
    __metadata("design:paramtypes", [third_party_service_1.ThirdPartyService])
], ThirdPartyController);
exports.ThirdPartyController = ThirdPartyController;
//# sourceMappingURL=third-party.controller.js.map