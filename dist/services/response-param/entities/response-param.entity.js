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
exports.ResponseParam = void 0;
const abstract_entity_1 = require("../../../common/entities/abstract.entity");
const typeorm_1 = require("typeorm");
let ResponseParam = class ResponseParam extends abstract_entity_1.AbstractEntity {
    fromResponseParamDto(responseParamDto) {
        if (responseParamDto.id) {
            this.id = responseParamDto.id;
        }
        this.paramDefault = responseParamDto.paramDefault;
        this.paramChange = responseParamDto.paramChange;
        this.type = responseParamDto.type.join();
        this.defaultData = responseParamDto.defaultData;
        this.parentId = responseParamDto.parentId;
        this.mappingApiId = responseParamDto.mappingApiId;
        if (responseParamDto.delete) {
            this.setIsDelete(true);
        }
        return this;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ResponseParam.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ResponseParam.prototype, "paramDefault", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ResponseParam.prototype, "paramChange", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ResponseParam.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ResponseParam.prototype, "defaultData", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], ResponseParam.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ResponseParam.prototype, "mappingApiId", void 0);
ResponseParam = __decorate([
    (0, typeorm_1.Entity)()
], ResponseParam);
exports.ResponseParam = ResponseParam;
//# sourceMappingURL=response-param.entity.js.map