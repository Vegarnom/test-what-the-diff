"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseAuthModule = void 0;
const common_1 = require("@nestjs/common");
const request_http_module_1 = require("../request-http/request-http.module");
const firebase_auth_service_1 = require("./firebase-auth.service");
let FirebaseAuthModule = class FirebaseAuthModule {
};
FirebaseAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            request_http_module_1.RequestHttpModule
        ],
        providers: [firebase_auth_service_1.FirebaseAuthService],
        exports: [firebase_auth_service_1.FirebaseAuthService],
    })
], FirebaseAuthModule);
exports.FirebaseAuthModule = FirebaseAuthModule;
//# sourceMappingURL=firebase-auth.module.js.map