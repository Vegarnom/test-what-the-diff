import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceModule } from '../device/device.module';
import { OrganizationModule } from '../organization/organization.module';
import { TypeBrandDeviceModule } from '../type-brand-device/type-brand-device.module';
import { TypeDeviceModule } from '../type-device/type-device.module';
import { DeviceHistoryController } from './device-history.controller';
import { DeviceHistoryService } from './device-history.service';
import { DeviceHistory } from './entities/device-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceHistory]),
    DeviceModule,
    OrganizationModule,
    TypeBrandDeviceModule,
    TypeDeviceModule,
  ],
  controllers: [DeviceHistoryController],
  providers: [DeviceHistoryService],
})
export class DeviceHistoryModule {}