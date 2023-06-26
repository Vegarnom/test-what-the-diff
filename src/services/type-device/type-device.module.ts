import { forwardRef, Module } from '@nestjs/common';
import { TypeDeviceService } from './type-device.service';
import { TypeDeviceController } from './type-device.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeDevice } from './entities/type-device.entity';
import { TypeBrandDeviceModule } from '../type-brand-device/type-brand-device.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeDevice]),
    forwardRef(() => TypeBrandDeviceModule),
  ],
  controllers: [TypeDeviceController],
  providers: [TypeDeviceService],
  exports: [TypeDeviceService],
})
export class TypeDeviceModule {}
