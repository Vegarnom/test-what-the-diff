import { Module } from '@nestjs/common';
import { RequestParamService } from './request-param.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestParam } from './entities/request-param.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequestParam])],
  providers: [RequestParamService],
  exports: [RequestParamService],
})
export class RequestParamModule {}
