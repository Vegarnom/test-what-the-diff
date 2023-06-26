"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseCodeModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const mapping_api_module_1 = require("../mapping-api/mapping-api.module");
const response_code_entity_1 = require("./entities/response-code.entity");
const response_code_controller_1 = require("./response-code.controller");
const response_code_service_1 = require("./response-code.service");
let ResponseCodeModule = class ResponseCodeModule {
};
ResponseCodeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([response_code_entity_1.ResponseCode]),
            (0, common_1.forwardRef)(() => mapping_api_module_1.MappingApiModule),
        ],
        controllers: [response_code_controller_1.ResponseCodeController],
        providers: [response_code_service_1.ResponseCodeService],
        exports: [response_code_service_1.ResponseCodeService],
    })
], ResponseCodeModule);
exports.ResponseCodeModule = ResponseCodeModule;
//# sourceMappingURL=response-code.module.js.map