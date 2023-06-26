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
exports.CreateRequestParamDto = void 0;
const class_validator_1 = require("class-validator");
class CreateRequestParamDto {
    fromRequestParam(requestParam) {
        this.id = requestParam.id;
        this.paramDefault = requestParam.paramDefault;
        this.paramChange = requestParam.paramChange;
        this.type = requestParam.type.split(',');
        this.defaultData = requestParam.defaultData;
        this.children = new Array();
        this.parentId = requestParam.parentId;
        this.mappingApiId = requestParam.mappingApiId;
        return this;
    }
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], CreateRequestParamDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateRequestParamDto.prototype, "children", void 0);
exports.CreateRequestParamDto = CreateRequestParamDto;
//# sourceMappingURL=create-request-param.dto.js.map