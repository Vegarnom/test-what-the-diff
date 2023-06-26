"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationKioskModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const firebase_auth_module_1 = require("../firebase-auth/firebase-auth.module");
const third_party_module_1 = require("../third-party/third-party.module");
const token_provider_module_1 = require("../token-provider/token-provider.module");
const authorization_controller_1 = require("./authorization.controller");
const authorization_service_1 = require("./authorization.service");
const authorization_kiosk_entity_1 = require("./entities/authorization-kiosk.entity");
let AuthorizationKioskModule = class AuthorizationKioskModule {
};
AuthorizationKioskModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([authorization_kiosk_entity_1.AuthorizationKiosk]),
            (0, common_1.forwardRef)(() => third_party_module_1.ThirdPartyModule),
            token_provider_module_1.TokenProviderModule,
            firebase_auth_module_1.FirebaseAuthModule,
        ],
        providers: [authorization_service_1.AuthorizationKioskService],
        controllers: [authorization_controller_1.AuthorizationKioskController],
        exports: [authorization_service_1.AuthorizationKioskService],
    })
], AuthorizationKioskModule);
exports.AuthorizationKioskModule = AuthorizationKioskModule;
//# sourceMappingURL=authorization.module.js.map