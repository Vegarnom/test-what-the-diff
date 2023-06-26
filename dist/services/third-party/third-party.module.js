"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThirdPartyModule = void 0;
const common_1 = require("@nestjs/common");
const third_party_service_1 = require("./third-party.service");
const third_party_controller_1 = require("./third-party.controller");
const typeorm_1 = require("@nestjs/typeorm");
const third_party_entity_1 = require("./entities/third-party.entity");
const third_party_api_module_1 = require("../third-party-api/third-party-api.module");
const authorization_module_1 = require("../authorization-kiosk/authorization.module");
let ThirdPartyModule = class ThirdPartyModule {
};
ThirdPartyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([third_party_entity_1.ThirdParty]),
            (0, common_1.forwardRef)(() => third_party_api_module_1.ThirdPartyApiModule),
            (0, common_1.forwardRef)(() => authorization_module_1.AuthorizationKioskModule),
        ],
        controllers: [third_party_controller_1.ThirdPartyController],
        providers: [third_party_service_1.ThirdPartyService],
        exports: [third_party_service_1.ThirdPartyService],
    })
], ThirdPartyModule);
exports.ThirdPartyModule = ThirdPartyModule;
//# sourceMappingURL=third-party.module.js.map