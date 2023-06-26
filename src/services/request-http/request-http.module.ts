import { Module } from '@nestjs/common';
import { RequestHttpService } from './request-http.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: Number(process.env.AXIOS_SET_TIMEOUT) || 10000,
        maxRedirects: Number(process.env.AXIOS_SET_MAX_REDIRECTS) || 5,
      }),
    }),
  ],
  providers: [RequestHttpService],
  exports: [RequestHttpService],
})
export class RequestHttpModule {}
