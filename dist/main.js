"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const nest_winston_1 = require("nest-winston");
const iot_guard_1 = require("./guard/iot.guard");
const xmlParser = require('express-xml-bodyparser');
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useLogger(app.get(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER));
    app.use(xmlParser({
        trim: true,
        explicitArray: false,
        normalize: false,
        normalizeTags: false,
    }));
    app.set('trust proxy', (ip) => {
        console.log('IP: ', ip);
        return true;
    });
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useGlobalGuards(new iot_guard_1.IoTGuard());
    await app.listen(3001);
}
bootstrap();
//# sourceMappingURL=main.js.map