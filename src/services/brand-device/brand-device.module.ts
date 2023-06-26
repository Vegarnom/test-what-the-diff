import { forwardRef, Module } from '@nestjs/common';
import { BrandDeviceService } from './brand-device.service';
import { BrandDeviceController } from './brand-device.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandDevice } from './entities/brand-device.entity';
import { TypeBrandDeviceModule } from '../type-brand-device/type-brand-device.module';
import { TokenDeviceModule } from '../token-device/token-device.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    TypeOrmModule.forFeature([BrandDevice]),
    forwardRef(() => TypeBrandDeviceModule),
    forwardRef(() => TokenDeviceModule),
    NestjsFormDataModule,

  ],
  controllers: [BrandDeviceController],
  providers: [BrandDeviceService],
  exports: [BrandDeviceService],
})
export class BrandDeviceModule {}
