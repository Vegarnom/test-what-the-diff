"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThirdPartyApiModule = void 0;
const common_1 = require("@nestjs/common");
const third_party_api_service_1 = require("./third-party-api.service");
const third_party_api_controller_1 = require("./third-party-api.controller");
const typeorm_1 = require("@nestjs/typeorm");
const third_party_api_entity_1 = require("./entities/third-party-api.entity");
const third_party_module_1 = require("../third-party/third-party.module");
const mapping_api_module_1 = require("../mapping-api/mapping-api.module");
let ThirdPartyApiModule = class ThirdPartyApiModule {
};
ThirdPartyApiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => third_party_module_1.ThirdPartyModule),
            typeorm_1.TypeOrmModule.forFeature([third_party_api_entity_1.ThirdPartyApi]),
            (0, common_1.forwardRef)(() => mapping_api_module_1.MappingApiModule),
        ],
        controllers: [third_party_api_controller_1.ThirdPartyApiController],
        providers: [third_party_api_service_1.ThirdPartyApiService],
        exports: [third_party_api_service_1.ThirdPartyApiService],
    })
], ThirdPartyApiModule);
exports.ThirdPartyApiModule = ThirdPartyApiModule;
//# sourceMappingURL=third-party-api.module.js.map