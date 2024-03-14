import { Module } from "@nestjs/common";
import { MailerModule as NestMailerModule } from "@nestjs-modules/mailer";
import { MailerService } from "./mailer.service";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

@Module({
  imports: [
    NestMailerModule.forRoot({
      transport: {
        host: "smtp.daum.net",
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PW,
        },
      },
      defaults: {
        from: process.env.MAIL_ADDRESS,
      },
      template: {
        dir: __dirname + "/templates",
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailerService],
})
export class MailerModule {}
