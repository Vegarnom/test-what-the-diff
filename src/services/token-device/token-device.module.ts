import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandDeviceModule } from '../brand-device/brand-device.module';
import { OrganizationModule } from '../organization/organization.module';
import { TokenDevice } from './entities/token-device.entity';
import { TokenDeviceController } from './token-device.controller';
import { TokenDeviceService } from './token-device.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TokenDevice]),
    OrganizationModule,
    forwardRef(() => BrandDeviceModule),
  ],
  controllers: [TokenDeviceController],
  providers: [TokenDeviceService],
  exports: [TokenDeviceService],
})
export class TokenDeviceModule {}
