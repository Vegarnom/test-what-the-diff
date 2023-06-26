import { forwardRef, Module } from '@nestjs/common';
import { TypeBrandDeviceService } from './type-brand-device.service';
import { TypeBrandDeviceController } from './type-brand-device.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeBrandDevice } from './entities/type-brand-device.entity';
import { TypeDeviceModule } from '../type-device/type-device.module';
import { BrandDeviceModule } from '../brand-device/brand-device.module';
import { MappingApiModule } from '../mapping-api/mapping-api.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeBrandDevice]),
    forwardRef(() => TypeDeviceModule),
    forwardRef(() => BrandDeviceModule),
    forwardRef(() => MappingApiModule),
  ],
  controllers: [TypeBrandDeviceController],
  providers: [TypeBrandDeviceService],
  exports: [TypeBrandDeviceService],
})
export class TypeBrandDeviceModule {}
