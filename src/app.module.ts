import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/configuration-db';
import { loggerConfig } from './config/configuration-logger';
import { AuthModule } from './services/auth/auth.module';
import { SesameModule } from './services/sesame/sesame.module';
import { DevicesModule } from './services/devices/devices.module';
import { WinstonModule } from 'nest-winston';
import { TokenProviderModule } from './services/token-provider/token-provider.module';
import { StructureModule } from './services/structure/structure.module';
import { StructureOrganizationModule } from './services/structure-organization/structure-organization.module';
import { OrganizationModule } from './services/organization/organization.module';
import { TypeDeviceModule } from './services/type-device/type-device.module';
import { BrandDeviceModule } from './services/brand-device/brand-device.module';
import { TypeBrandDeviceModule } from './services/type-brand-device/type-brand-device.module';
import { DeviceModule } from './services/device/device.module';
import { DeviceHistoryModule } from './services/device-history/device-histoty.module';
import { ThirdPartyModule } from './services/third-party/third-party.module';
import { ThirdPartyApiModule } from './services/third-party-api/third-party-api.module';
import { ResponseParamModule } from './services/response-param/response-param.module';
import { RequestParamModule } from './services/request-param/request-param.module';
import { MappingApiModule } from './services/mapping-api/mapping-api.module';
import { ResponseCodeModule } from './services/response-code/response-code.module';
import { TokenDeviceModule } from './services/token-device/token-device.module';
import { AuthorizationKioskModule } from './services/authorization-kiosk/authorization.module';
import { IpFilterMiddleware } from './middleware/applyIP.middleware';
import { MulterModule } from '@nestjs/platform-express';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot(loggerConfig),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
    SesameModule,
    DevicesModule,
    TokenProviderModule,
    StructureModule,
    StructureOrganizationModule,
    OrganizationModule,
    TypeDeviceModule,
    BrandDeviceModule,
    TypeBrandDeviceModule,
    DeviceModule,
    DeviceHistoryModule,
    ThirdPartyModule,
    ThirdPartyApiModule,
    ResponseParamModule,
    RequestParamModule,
    MappingApiModule,
    ResponseCodeModule,
    OrganizationModule,
    TypeDeviceModule,
    BrandDeviceModule,
    TypeBrandDeviceModule,
    DeviceModule,
    DeviceHistoryModule,
    TokenDeviceModule,
    AuthorizationKioskModule,
    MulterModule.register({
      dest: './uploads',
    }),

  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpFilterMiddleware).forRoutes('/mapping-api/request/**')
  }
}
