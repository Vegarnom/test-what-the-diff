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
exports.RequestParam = void 0;
const abstract_entity_1 = require("../../../common/entities/abstract.entity");
const typeorm_1 = require("typeorm");
let RequestParam = class RequestParam extends abstract_entity_1.AbstractEntity {
    fromRequestParamDto(requestParamDto) {
        if (requestParamDto.id) {
            this.id = requestParamDto.id;
        }
        this.paramDefault = requestParamDto.paramDefault;
        this.paramChange = requestParamDto.paramChange;
        this.type = requestParamDto.type.join();
        this.defaultData = requestParamDto.defaultData;
        this.parentId = requestParamDto.parentId;
        this.mappingApiId = requestParamDto.mappingApiId;
        if (requestParamDto.delete) {
            this.setIsDelete(true);
        }
        return this;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RequestParam.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestParam.prototype, "paramDefault", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestParam.prototype, "paramChange", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RequestParam.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestParam.prototype, "defaultData", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], RequestParam.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RequestParam.prototype, "mappingApiId", void 0);
RequestParam = __decorate([
    (0, typeorm_1.Entity)()
], RequestParam);
exports.RequestParam = RequestParam;
//# sourceMappingURL=request-param.entity.js.map