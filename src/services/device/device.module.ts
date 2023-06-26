import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationModule } from '../organization/organization.module';
import { TypeBrandDeviceModule } from '../type-brand-device/type-brand-device.module';
import { TypeDeviceModule } from '../type-device/type-device.module';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { Device } from './entities/device.entity';
import { TokenDeviceModule } from '../token-device/token-device.module';
import { HttpModule } from '@nestjs/axios';
import { BrandDeviceModule } from '../brand-device/brand-device.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device]),
    OrganizationModule,
    TypeBrandDeviceModule,
    TokenDeviceModule,
    TypeDeviceModule,
    BrandDeviceModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
