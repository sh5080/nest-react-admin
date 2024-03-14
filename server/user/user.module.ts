import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthModule } from "../auth/auth.module";
import { PrismaModule } from "../prisma/prisma.module";
import { UserRepository } from "./user.repository";
import { MailerService } from "../mailer/mailer.service";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UserController],
  providers: [MailerService, UserService, UserRepository],
})
export class UserModule {}
