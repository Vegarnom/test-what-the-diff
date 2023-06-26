"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_entity_1 = require("../services/auth/entities/auth.entity");
const devices_entity_1 = require("../services/devices/entities/devices.entity");
const sesame_lock_code_entity_1 = require("../services/sesame/entities/sesame-lock-code.entity");
const type_device_entity_1 = require("../services/type-device/entities/type-device.entity");
const brand_device_entity_1 = require("../services/brand-device/entities/brand-device.entity");
const type_brand_device_entity_1 = require("../services/type-brand-device/entities/type-brand-device.entity");
const third_party_entity_1 = require("../services/third-party/entities/third-party.entity");
const third_party_api_entity_1 = require("../services/third-party-api/entities/third-party-api.entity");
const response_param_entity_1 = require("../services/response-param/entities/response-param.entity");
const request_param_entity_1 = require("../services/request-param/entities/request-param.entity");
const mapping_api_entity_1 = require("../services/mapping-api/entities/mapping-api.entity");
const dotenv = require("dotenv");
const response_code_entity_1 = require("../services/response-code/entities/response-code.entity");
const authorization_kiosk_entity_1 = require("../services/authorization-kiosk/entities/authorization-kiosk.entity");
dotenv.config();
const databaseConfig = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    entities: [
        auth_entity_1.Auth,
        devices_entity_1.Devices,
        sesame_lock_code_entity_1.SesameLockCode,
        type_device_entity_1.TypeDevice,
        brand_device_entity_1.BrandDevice,
        type_brand_device_entity_1.TypeBrandDevice,
        third_party_entity_1.ThirdParty,
        third_party_api_entity_1.ThirdPartyApi,
        response_param_entity_1.ResponseParam,
        request_param_entity_1.RequestParam,
        mapping_api_entity_1.MappingApi,
        response_code_entity_1.ResponseCode,
        authorization_kiosk_entity_1.AuthorizationKiosk
    ],
    migrations: ['./dist/migrations/*.{ts,js}'],
    migrationsTableName: 'migrations_history',
    extra: {
        charset: 'utf8mb4_unicode_ci',
    },
    synchronize: false,
    migrationsRun: true,
    logging: false,
    logger: 'advanced-console',
};
exports.default = databaseConfig;
//# sourceMappingURL=database-config.js.map