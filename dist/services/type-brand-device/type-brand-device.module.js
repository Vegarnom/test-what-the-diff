"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeBrandDeviceModule = void 0;
const common_1 = require("@nestjs/common");
const type_brand_device_service_1 = require("./type-brand-device.service");
const type_brand_device_controller_1 = require("./type-brand-device.controller");
const typeorm_1 = require("@nestjs/typeorm");
const type_brand_device_entity_1 = require("./entities/type-brand-device.entity");
const type_device_module_1 = require("../type-device/type-device.module");
const brand_device_module_1 = require("../brand-device/brand-device.module");
const mapping_api_module_1 = require("../mapping-api/mapping-api.module");
let TypeBrandDeviceModule = class TypeBrandDeviceModule {
};
TypeBrandDeviceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([type_brand_device_entity_1.TypeBrandDevice]),
            (0, common_1.forwardRef)(() => type_device_module_1.TypeDeviceModule),
            (0, common_1.forwardRef)(() => brand_device_module_1.BrandDeviceModule),
            (0, common_1.forwardRef)(() => mapping_api_module_1.MappingApiModule),
        ],
        controllers: [type_brand_device_controller_1.TypeBrandDeviceController],
        providers: [type_brand_device_service_1.TypeBrandDeviceService],
        exports: [type_brand_device_service_1.TypeBrandDeviceService],
    })
], TypeBrandDeviceModule);
exports.TypeBrandDeviceModule = TypeBrandDeviceModule;
//# sourceMappingURL=type-brand-device.module.js.map