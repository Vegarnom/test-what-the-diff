"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappingApiModule = void 0;
const common_1 = require("@nestjs/common");
const mapping_api_service_1 = require("./mapping-api.service");
const mapping_api_controller_1 = require("./mapping-api.controller");
const typeorm_1 = require("@nestjs/typeorm");
const mapping_api_entity_1 = require("./entities/mapping-api.entity");
const third_party_api_module_1 = require("../third-party-api/third-party-api.module");
const type_brand_device_module_1 = require("../type-brand-device/type-brand-device.module");
const request_param_module_1 = require("../request-param/request-param.module");
const response_param_module_1 = require("../response-param/response-param.module");
const request_http_module_1 = require("../request-http/request-http.module");
const response_code_module_1 = require("../response-code/response-code.module");
const authorization_module_1 = require("../authorization-kiosk/authorization.module");
const type_device_module_1 = require("../type-device/type-device.module");
const brand_device_module_1 = require("../brand-device/brand-device.module");
let MappingApiModule = class MappingApiModule {
};
MappingApiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => third_party_api_module_1.ThirdPartyApiModule),
            (0, common_1.forwardRef)(() => type_brand_device_module_1.TypeBrandDeviceModule),
            request_param_module_1.RequestParamModule,
            response_param_module_1.ResponseParamModule,
            request_http_module_1.RequestHttpModule,
            authorization_module_1.AuthorizationKioskModule,
            (0, common_1.forwardRef)(() => response_code_module_1.ResponseCodeModule),
            typeorm_1.TypeOrmModule.forFeature([mapping_api_entity_1.MappingApi]),
            (0, common_1.forwardRef)(() => type_device_module_1.TypeDeviceModule),
            brand_device_module_1.BrandDeviceModule,
        ],
        controllers: [mapping_api_controller_1.MappingApiController],
        providers: [mapping_api_service_1.MappingApiService],
        exports: [mapping_api_service_1.MappingApiService],
    })
], MappingApiModule);
exports.MappingApiModule = MappingApiModule;
//# sourceMappingURL=mapping-api.module.js.map