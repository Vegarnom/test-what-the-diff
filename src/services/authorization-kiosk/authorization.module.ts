import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThirdPartyModule } from '../third-party/third-party.module';
import { TokenProviderModule } from '../token-provider/token-provider.module';
import { AuthorizationKioskController } from './authorization.controller';
import { AuthorizationKioskService } from './authorization.service';
import { AuthorizationKiosk } from './entities/authorization-kiosk.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthorizationKiosk]),
    forwardRef(() => ThirdPartyModule),
    TokenProviderModule,
  ],
  providers: [AuthorizationKioskService],
  controllers: [AuthorizationKioskController],
  exports: [AuthorizationKioskService],
})
export class AuthorizationKioskModule {}
