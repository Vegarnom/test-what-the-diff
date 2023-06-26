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
exports.ResponseCodeController = void 0;
const common_1 = require("@nestjs/common");
const response_1 = require("../../common/helper/response");
const response_code_service_1 = require("./response-code.service");
let ResponseCodeController = class ResponseCodeController {
    constructor(reponseCodeService) {
        this.reponseCodeService = reponseCodeService;
    }
    async getByMappingApiId(mappingApiId, res) {
        return (0, response_1.responseData)(res, await this.reponseCodeService.findAllMappingApiId(mappingApiId));
    }
    async update(listResponseCode, res) {
        return (0, response_1.responseData)(res, await this.reponseCodeService.update(listResponseCode));
    }
};
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ResponseCodeController.prototype, "getByMappingApiId", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ResponseCodeController.prototype, "update", null);
ResponseCodeController = __decorate([
    (0, common_1.Controller)('response-code'),
    __metadata("design:paramtypes", [response_code_service_1.ResponseCodeService])
], ResponseCodeController);
exports.ResponseCodeController = ResponseCodeController;
//# sourceMappingURL=response-code.controller.js.map