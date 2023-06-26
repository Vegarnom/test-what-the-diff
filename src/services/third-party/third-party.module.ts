import { forwardRef, Module } from '@nestjs/common';
import { ThirdPartyService } from './third-party.service';
import { ThirdPartyController } from './third-party.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThirdParty } from './entities/third-party.entity';
import { ThirdPartyApiModule } from '../third-party-api/third-party-api.module';
import { AuthorizationKioskModule } from '../authorization-kiosk/authorization.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ThirdParty]),
    forwardRef(() => ThirdPartyApiModule),
    forwardRef(() => AuthorizationKioskModule),
  ],
  controllers: [ThirdPartyController],
  providers: [ThirdPartyService],
  exports: [ThirdPartyService],
})
export class ThirdPartyModule {}
