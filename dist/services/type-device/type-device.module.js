"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeDeviceModule = void 0;
const common_1 = require("@nestjs/common");
const type_device_service_1 = require("./type-device.service");
const type_device_controller_1 = require("./type-device.controller");
const typeorm_1 = require("@nestjs/typeorm");
const type_device_entity_1 = require("./entities/type-device.entity");
const type_brand_device_module_1 = require("../type-brand-device/type-brand-device.module");
let TypeDeviceModule = class TypeDeviceModule {
};
TypeDeviceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([type_device_entity_1.TypeDevice]),
            (0, common_1.forwardRef)(() => type_brand_device_module_1.TypeBrandDeviceModule),
        ],
        controllers: [type_device_controller_1.TypeDeviceController],
        providers: [type_device_service_1.TypeDeviceService],
        exports: [type_device_service_1.TypeDeviceService],
    })
], TypeDeviceModule);
exports.TypeDeviceModule = TypeDeviceModule;
//# sourceMappingURL=type-device.module.js.map