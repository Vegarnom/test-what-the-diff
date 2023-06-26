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
exports.CreateResponseParamDto = void 0;
const class_validator_1 = require("class-validator");
class CreateResponseParamDto {
    fromRequestParam(responseParam) {
        this.id = responseParam.id;
        this.paramDefault = responseParam.paramDefault;
        this.paramChange = responseParam.paramChange;
        this.type = responseParam.type.split(',');
        this.defaultData = responseParam.defaultData;
        this.children = new Array();
        this.parentId = responseParam.parentId;
        this.mappingApiId = responseParam.mappingApiId;
        return this;
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], CreateResponseParamDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateResponseParamDto.prototype, "children", void 0);
exports.CreateResponseParamDto = CreateResponseParamDto;
//# sourceMappingURL=create-response-param.dto.js.map