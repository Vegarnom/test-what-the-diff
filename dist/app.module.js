"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const configuration_db_1 = require("./config/configuration-db");
const configuration_logger_1 = require("./config/configuration-logger");
const auth_module_1 = require("./services/auth/auth.module");
const sesame_module_1 = require("./services/sesame/sesame.module");
const devices_module_1 = require("./services/devices/devices.module");
const nest_winston_1 = require("nest-winston");
const token_provider_module_1 = require("./services/token-provider/token-provider.module");
const type_device_module_1 = require("./services/type-device/type-device.module");
const brand_device_module_1 = require("./services/brand-device/brand-device.module");
const type_brand_device_module_1 = require("./services/type-brand-device/type-brand-device.module");
const third_party_module_1 = require("./services/third-party/third-party.module");
const third_party_api_module_1 = require("./services/third-party-api/third-party-api.module");
const response_param_module_1 = require("./services/response-param/response-param.module");
const request_param_module_1 = require("./services/request-param/request-param.module");
const mapping_api_module_1 = require("./services/mapping-api/mapping-api.module");
const response_code_module_1 = require("./services/response-code/response-code.module");
const authorization_module_1 = require("./services/authorization-kiosk/authorization.module");
const applyIP_middleware_1 = require("./middleware/applyIP.middleware");
const firebase_auth_module_1 = require("./services/firebase-auth/firebase-auth.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(applyIP_middleware_1.IpFilterMiddleware).forRoutes('/mapping-api/request/**');
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            nest_winston_1.WinstonModule.forRoot(configuration_logger_1.loggerConfig),
            typeorm_1.TypeOrmModule.forRootAsync(configuration_db_1.typeOrmAsyncConfig),
            auth_module_1.AuthModule,
            sesame_module_1.SesameModule,
            devices_module_1.DevicesModule,
            token_provider_module_1.TokenProviderModule,
            type_device_module_1.TypeDeviceModule,
            brand_device_module_1.BrandDeviceModule,
            type_brand_device_module_1.TypeBrandDeviceModule,
            third_party_module_1.ThirdPartyModule,
            third_party_api_module_1.ThirdPartyApiModule,
            response_param_module_1.ResponseParamModule,
            request_param_module_1.RequestParamModule,
            mapping_api_module_1.MappingApiModule,
            response_code_module_1.ResponseCodeModule,
            authorization_module_1.AuthorizationKioskModule,
            firebase_auth_module_1.FirebaseAuthModule,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map