import { Injectable } from "@nestjs/common";
import { MailerService as NestMailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestMailerService) {}
  async sendChangePasswordEmail(
    email: string,
    nickname: string,
    recoveryCode: string
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: "바야바즈 고객센터 CMS 비밀번호 재설정 코드를 안내드립니다.",
        template: "password-code.script.hbs",
        context: {
          nickname,
          recoveryCode,
        },
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
