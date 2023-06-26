import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MappingApiModule } from '../mapping-api/mapping-api.module';
import { ResponseCode } from './entities/response-code.entity';
import { ResponseCodeController } from './response-code.controller';
import { ResponseCodeService } from './response-code.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([ResponseCode]),
    forwardRef(() => MappingApiModule),
  ],
  controllers: [ResponseCodeController],
  providers: [ResponseCodeService],
  exports: [ResponseCodeService],
})
export class ResponseCodeModule {}
