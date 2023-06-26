"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SesameModule = void 0;
const common_1 = require("@nestjs/common");
const sesame_service_1 = require("./sesame.service");
const sesame_controller_1 = require("./sesame.controller");
const request_http_module_1 = require("../request-http/request-http.module");
const typeorm_1 = require("@nestjs/typeorm");
const sesame_lock_code_entity_1 = require("./entities/sesame-lock-code.entity");
const jwt_1 = require("@nestjs/jwt");
let SesameModule = class SesameModule {
};
SesameModule = __decorate([
    (0, common_1.Module)({
        imports: [
            request_http_module_1.RequestHttpModule,
            jwt_1.JwtModule,
            typeorm_1.TypeOrmModule.forFeature([sesame_lock_code_entity_1.SesameLockCode]),
        ],
        providers: [sesame_service_1.SesameService],
        controllers: [sesame_controller_1.SesameController],
    })
], SesameModule);
exports.SesameModule = SesameModule;
//# sourceMappingURL=sesame.module.js.map