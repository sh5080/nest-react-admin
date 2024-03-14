import { Logger, ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import expressBasicAuth from 'express-basic-auth';

import { AppModule } from './app.module';
import { setupSwagger } from './utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: process.env.FRONT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };

  app.enableCors(corsOptions);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  app.use(
    ['/docs'],
    expressBasicAuth({
      challenge: true,
      users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PWD },
    })
  );
  setupSwagger(app);

  await app.listen(process.env.SERVER_PORT || 3000);
  Logger.log(`Server is running on ${await app.getUrl()}`);
}
bootstrap();
