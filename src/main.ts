import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from "@nestjs/platform-express";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { IoTGuard } from './guard/iot.guard';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';
const xmlParser = require('express-xml-bodyparser');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.use(
    xmlParser({
      trim: true,
      explicitArray: false,
      normalize: false,
      normalizeTags: false,
    }),
  );
  app.set('trust proxy', (ip) => {
    console.log('IP: ', ip);
    return true;
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new IoTGuard());

  const configService = app.get(ConfigService);
  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_S3'),
    secretAccessKey: configService.get('AWS_SECRET_KEY_S3'),
    region: configService.get('AWS_REGION'),
  });

  await app.listen(3001);
}
bootstrap();
