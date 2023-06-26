import { forwardRef, Module } from '@nestjs/common';
import { ThirdPartyApiService } from './third-party-api.service';
import { ThirdPartyApiController } from './third-party-api.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThirdPartyApi } from './entities/third-party-api.entity';
import { ThirdPartyModule } from '../third-party/third-party.module';
import { MappingApiModule } from '../mapping-api/mapping-api.module';

@Module({
  imports: [
    forwardRef(() => ThirdPartyModule),
    TypeOrmModule.forFeature([ThirdPartyApi]),
    forwardRef(() => MappingApiModule),
  ],
  controllers: [ThirdPartyApiController],
  providers: [ThirdPartyApiService],
  exports: [ThirdPartyApiService],
})
export class ThirdPartyApiModule {}
