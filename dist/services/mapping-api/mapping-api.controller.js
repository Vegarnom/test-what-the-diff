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
exports.MappingApiController = void 0;
const common_1 = require("@nestjs/common");
const mapping_api_service_1 = require("./mapping-api.service");
const create_mapping_api_dto_1 = require("./dto/create-mapping-api.dto");
const update_mapping_api_dto_1 = require("./dto/update-mapping-api.dto");
const response_1 = require("../../common/helper/response");
let MappingApiController = class MappingApiController {
    constructor(mappingApiService) {
        this.mappingApiService = mappingApiService;
    }
    async create(createMappingApiDto, res) {
        return (0, response_1.responseData)(res, await this.mappingApiService.create(createMappingApiDto));
    }
    async getAll(res) {
        return (0, response_1.responseData)(res, await this.mappingApiService.getAll());
    }
    async findAll(typeBrandId, res) {
        if (typeBrandId) {
            return (0, response_1.responseData)(res, await this.mappingApiService.findAllByTypeBrandId(typeBrandId));
        }
        return (0, response_1.responseData)(res, null);
    }
    async findOne(id, res) {
        return (0, response_1.responseData)(res, await this.mappingApiService.findOne(id));
    }
    async update(id, updateMappingApiDto, res) {
        return (0, response_1.responseData)(res, await this.mappingApiService.update(id, updateMappingApiDto));
    }
    async remove(id, res) {
        return (0, response_1.responseData)(res, await this.mappingApiService.remove(id));
    }
    async requestGet(key, name, body, query, req, res) {
        let contentType = 'json';
        if (typeof req.headers['content-type'] === 'string') {
            contentType = req.headers['content-type'].split('/')[1];
        }
        console.log('haha', query);
        const apiKey = req.headers['x-api-key'] || '';
        const response = await this.mappingApiService.request(key, name, 'GET', contentType, body, apiKey, query);
        if (response && response.catch) {
            return (0, response_1.responseData)(res, response.data, response.status);
        }
        return (0, response_1.responseData)(res, response);
    }
    async requestPost(key, name, body, query, req, res) {
        let contentType = 'json';
        if (typeof req.headers['content-type'] === 'string') {
            contentType = req.headers['content-type'].split('/')[1];
        }
        const apiKey = req.headers['x-api-key'] || '';
        console.log('haha', query);
        const response = await this.mappingApiService.request(key, name, 'POST', contentType, body, apiKey, query);
        if (response && response.catch) {
            return (0, response_1.responseData)(res, response.data, response.status);
        }
        return (0, response_1.responseData)(res, response);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_mapping_api_dto_1.CreateMappingApiDto, Object]),
    __metadata("design:returntype", Promise)
], MappingApiController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('all'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MappingApiController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('typeBrandId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MappingApiController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MappingApiController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_mapping_api_dto_1.UpdateMappingApiDto, Object]),
    __metadata("design:returntype", Promise)
], MappingApiController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MappingApiController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('request/:key/:name'),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Param)('name')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Req)()),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MappingApiController.prototype, "requestGet", null);
__decorate([
    (0, common_1.Post)('request/:key/:name'),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Param)('name')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Req)()),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MappingApiController.prototype, "requestPost", null);
MappingApiController = __decorate([
    (0, common_1.Controller)('mapping-api'),
    __metadata("design:paramtypes", [mapping_api_service_1.MappingApiService])
], MappingApiController);
exports.MappingApiController = MappingApiController;
//# sourceMappingURL=mapping-api.controller.js.map