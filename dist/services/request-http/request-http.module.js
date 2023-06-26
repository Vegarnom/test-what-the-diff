"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestHttpModule = void 0;
const common_1 = require("@nestjs/common");
const request_http_service_1 = require("./request-http.service");
const axios_1 = require("@nestjs/axios");
let RequestHttpModule = class RequestHttpModule {
};
RequestHttpModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule.registerAsync({
                useFactory: () => ({
                    timeout: Number(process.env.AXIOS_SET_TIMEOUT) || 10000,
                    maxRedirects: Number(process.env.AXIOS_SET_MAX_REDIRECTS) || 5,
                }),
            }),
        ],
        providers: [request_http_service_1.RequestHttpService],
        exports: [request_http_service_1.RequestHttpService],
    })
], RequestHttpModule);
exports.RequestHttpModule = RequestHttpModule;
//# sourceMappingURL=request-http.module.js.map