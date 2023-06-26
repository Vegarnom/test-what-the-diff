import { Module } from '@nestjs/common';
import { TokenProviderController } from './token-provider.controller';
import { TokenProviderService } from './token-provider.service';

@Module({
  controllers: [TokenProviderController],
  providers: [TokenProviderService],
  exports: [TokenProviderService]
})
export class TokenProviderModule {}
