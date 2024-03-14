import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { validationSchema } from "./config/validationSchema";
import { LoggerMiddleware } from "./middlewares/logger.middleware";
import { AuthModule } from "./auth/auth.module";

import { UserModule } from "./user/user.module";

import { MailerModule } from "./mailer/mailer.module";
import { APP_FILTER } from "@nestjs/core";
import { GlobalExceptionFilter } from "./middlewares/error.middleware";

import { AwsS3MulterConfigService } from "./middlewares/awsS3Multer.middleware";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    MailerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AwsS3MulterConfigService,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
