import { Auth } from '../services/auth/entities/auth.entity';
import { Devices } from '../services/devices/entities/devices.entity';
import { SesameLockCode } from '../services/sesame/entities/sesame-lock-code.entity';
import { Organization } from '../services/organization/entities/organization.entity';
import { TypeDevice } from '../services/type-device/entities/type-device.entity';
import { BrandDevice } from '../services/brand-device/entities/brand-device.entity';
import { TypeBrandDevice } from '../services/type-brand-device/entities/type-brand-device.entity';
import { Device } from '../services/device/entities/device.entity';
import { DeviceHistory } from '../services/device-history/entities/device-history.entity';
import { ThirdParty } from '../services/third-party/entities/third-party.entity';
import { ThirdPartyApi } from '../services/third-party-api/entities/third-party-api.entity';
import { ResponseParam } from '../services/response-param/entities/response-param.entity';
import { RequestParam } from '../services/request-param/entities/request-param.entity';
import { MappingApi } from '../services/mapping-api/entities/mapping-api.entity';
import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { Structure } from '../services/structure/entities/structure.entity';
import { StructureOrganization } from '../services/structure-organization/entities/structure-organization.entity';
import { TokenDevice } from '../services/token-device/entities/token-device.entity';
import { ResponseCode } from '../services/response-code/entities/response-code.entity';
import { AuthorizationKiosk } from '../services/authorization-kiosk/entities/authorization-kiosk.entity';

dotenv.config();

const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,

  entities: [
    Auth,
    Device,
    Devices,
    SesameLockCode,
    TypeDevice,
    BrandDevice,
    TypeBrandDevice,
    Organization,
    DeviceHistory,
    ThirdParty,
    ThirdPartyApi,
    ResponseParam,
    RequestParam,
    MappingApi,
    ResponseCode,
    AuthorizationKiosk,
    Structure,
    StructureOrganization,
    TokenDevice,
    AuthorizationKiosk
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

export default databaseConfig;
