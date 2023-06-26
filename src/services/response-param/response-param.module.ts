import { Module } from '@nestjs/common';
import { ResponseParamService } from './response-param.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseParam } from './entities/response-param.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResponseParam])],
  providers: [ResponseParamService],
  exports: [ResponseParamService],
})
export class ResponseParamModule {}
