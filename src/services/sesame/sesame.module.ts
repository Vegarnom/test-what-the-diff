import { Module } from '@nestjs/common';
import { SesameService } from './sesame.service';
import { SesameController } from './sesame.controller';
import { RequestHttpModule } from '../request-http/request-http.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SesameLockCode } from './entities/sesame-lock-code.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    RequestHttpModule,
    JwtModule,
    TypeOrmModule.forFeature([SesameLockCode]),
  ],
  providers: [SesameService],
  controllers: [SesameController],
})
export class SesameModule {}
