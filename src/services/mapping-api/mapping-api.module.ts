import { forwardRef, Module } from '@nestjs/common';
import { MappingApiService } from './mapping-api.service';
import { MappingApiController } from './mapping-api.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MappingApi } from './entities/mapping-api.entity';
import { ThirdPartyApiModule } from '../third-party-api/third-party-api.module';
import { TypeBrandDeviceModule } from '../type-brand-device/type-brand-device.module';
import { RequestParamModule } from '../request-param/request-param.module';
import { ResponseParamModule } from '../response-param/response-param.module';
import { RequestHttpModule } from '../request-http/request-http.module';
import { ResponseCodeModule } from '../response-code/response-code.module';
import { AuthorizationKioskModule } from '../authorization-kiosk/authorization.module';
import { TypeDeviceModule } from '../type-device/type-device.module';
import { BrandDeviceModule } from '../brand-device/brand-device.module';

@Module({
  imports: [
    forwardRef(() => ThirdPartyApiModule),
    forwardRef(() => TypeBrandDeviceModule),
    RequestParamModule,
    ResponseParamModule,
    RequestHttpModule,
    AuthorizationKioskModule,
    forwardRef(() => ResponseCodeModule),
    TypeOrmModule.forFeature([MappingApi]),
    forwardRef(() => TypeDeviceModule),
    BrandDeviceModule,
  ],
  controllers: [MappingApiController],
  providers: [MappingApiService],
  exports: [MappingApiService],
})
export class MappingApiModule {}
