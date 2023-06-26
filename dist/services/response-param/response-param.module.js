"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseParamModule = void 0;
const common_1 = require("@nestjs/common");
const response_param_service_1 = require("./response-param.service");
const typeorm_1 = require("@nestjs/typeorm");
const response_param_entity_1 = require("./entities/response-param.entity");
let ResponseParamModule = class ResponseParamModule {
};
ResponseParamModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([response_param_entity_1.ResponseParam])],
        providers: [response_param_service_1.ResponseParamService],
        exports: [response_param_service_1.ResponseParamService],
    })
], ResponseParamModule);
exports.ResponseParamModule = ResponseParamModule;
//# sourceMappingURL=response-param.module.js.map