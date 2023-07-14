import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger} from '@nestjs/common';
import {FormattingInterceptor} from './app/interceptor/formatting.interceptor';

import basicAuth = require('express-basic-auth');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = "api";
  process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
  });
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  await app.listen(port);
  app.useGlobalInterceptors(new FormattingInterceptor());

  const basicAuthCode = process.env.BASIC_AUTH_PASSWORD;
  if (basicAuthCode) {
    app.use(
        basicAuth({
          challenge: true,
          users: { admin: basicAuthCode },
        })
    );
  }

  Logger.log(
    `🚀 123Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
