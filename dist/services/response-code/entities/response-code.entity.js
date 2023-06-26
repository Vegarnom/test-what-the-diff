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
exports.ResponseCode = void 0;
const abstract_entity_1 = require("../../../common/entities/abstract.entity");
const typeorm_1 = require("typeorm");
let ResponseCode = class ResponseCode extends abstract_entity_1.AbstractEntity {
    fromResponseCodeDto(responseCodeDto) {
        this.id = responseCodeDto.id;
        this.codeDefault = responseCodeDto.codeDefault;
        this.codeChange = responseCodeDto.codeChange;
        this.default = responseCodeDto.default;
        this.mappingApiId = responseCodeDto.mappingApiId;
        if (responseCodeDto.delete) {
            if (responseCodeDto.id) {
                this.setIsDelete(true);
            }
            else {
                return null;
            }
        }
        return this;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ResponseCode.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ResponseCode.prototype, "codeDefault", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ResponseCode.prototype, "codeChange", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ResponseCode.prototype, "default", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ResponseCode.prototype, "mappingApiId", void 0);
ResponseCode = __decorate([
    (0, typeorm_1.Entity)()
], ResponseCode);
exports.ResponseCode = ResponseCode;
//# sourceMappingURL=response-code.entity.js.map