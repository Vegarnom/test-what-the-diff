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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappingApi = void 0;
const abstract_entity_1 = require("../../../common/entities/abstract.entity");
const typeorm_1 = require("typeorm");
let MappingApi = class MappingApi extends abstract_entity_1.AbstractEntity {
    fromCreateMappingApiDto(createMappingApiDto) {
        this.name = createMappingApiDto.name;
        this.endpoint = createMappingApiDto.endpoint;
        this.requestHeaderParam = createMappingApiDto.requestHeaderParam;
        this.note = createMappingApiDto.note;
        this.description = createMappingApiDto.description;
        this.thirdPartyApiId = createMappingApiDto.thirdPartyApiId;
        this.typeBrandId = createMappingApiDto.typeBrandId;
        this.method = createMappingApiDto.method;
        this.requestType = createMappingApiDto.requestType;
        this.responseType = createMappingApiDto.responseType;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MappingApi.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MappingApi.prototype, "endpoint", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MappingApi.prototype, "requestHeaderParam", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MappingApi.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MappingApi.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MappingApi.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MappingApi.prototype, "thirdPartyApiId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MappingApi.prototype, "typeBrandId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MappingApi.prototype, "method", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MappingApi.prototype, "requestType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MappingApi.prototype, "responseType", void 0);
MappingApi = __decorate([
    (0, typeorm_1.Entity)()
], MappingApi);
exports.MappingApi = MappingApi;
//# sourceMappingURL=mapping-api.entity.js.map