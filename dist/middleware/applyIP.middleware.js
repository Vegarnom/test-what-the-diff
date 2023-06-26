"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var IpFilterMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpFilterMiddleware = void 0;
const common_1 = require("@nestjs/common");
let IpFilterMiddleware = IpFilterMiddleware_1 = class IpFilterMiddleware {
    constructor() {
        this.logger = new common_1.Logger(IpFilterMiddleware_1.name);
    }
    use(req, res, next) {
        let allowApiId = [];
        const xAmznApigatewayApiId = req.headers['x-amzn-apigateway-api-id'];
        this.logger.log(`[x-amzn-apigateway-api-id]: ${xAmznApigatewayApiId}`);
        allowApiId = [process.env.AWS_NO_KEY_REST_API_ID, process.env.AWS_NEED_KEY_REST_API_ID];
        if (!allowApiId.includes(xAmznApigatewayApiId)) {
            throw new common_1.ForbiddenException('ID of API GATEWAY is forbidden');
        }
        next();
    }
};
IpFilterMiddleware = IpFilterMiddleware_1 = __decorate([
    (0, common_1.Injectable)()
], IpFilterMiddleware);
exports.IpFilterMiddleware = IpFilterMiddleware;
//# sourceMappingURL=applyIP.middleware.js.map