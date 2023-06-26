"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoTGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../services/auth/guards/jwt-auth.guard");
let IoTGuard = class IoTGuard {
    canActivate(context) {
        const url = context.getArgs()[0].url;
        console.log(url);
        if (url.includes('/mapping-api/request') || url.includes('/authorization-kiosk/pms') || url.includes('/auth/sign-in') || url.includes('/auth/sign-up'))
            return true;
        return new jwt_auth_guard_1.JwtAuthGuard().canActivate(context);
    }
};
IoTGuard = __decorate([
    (0, common_1.Injectable)()
], IoTGuard);
exports.IoTGuard = IoTGuard;
//# sourceMappingURL=iot.guard.js.map