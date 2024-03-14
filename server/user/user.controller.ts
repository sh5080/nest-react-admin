import {
  Controller,
  Post,
  Body,
  Res,
  Delete,
  ValidationPipe,
  Put,
  BadRequestException,
  NotAcceptableException,
  Get,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CodeVerifyDto, IsUserDto } from "./dto/sendMail.dto";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { MailerService } from "../mailer/mailer.service";
import { Response } from "express";
import {
  SuccessData,
  successCode,
  successMessage,
} from "../middlewares/error.middleware";

import { UpdateUserPasswordDto } from "./dto/user.dto";
import { AuthGuard } from "../auth/auth.guard";
import { CenterUser } from "../decorators/auth.decorator";
import { AuthRequest } from "../types/request.type";

@ApiTags("유저")
@Controller("api/user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService
  ) {}

  @Post("mail")
  async sendPasswordRecoveryMail(
    @Body() isUserDto: IsUserDto,
    @Res() res: Response
  ) {
    try {
      const userData = await this.userService.getUserByEmail(
        isUserDto
      );
 
      if (userData.valid === false) {
        throw new NotAcceptableException(
          "제한되어 이용이 불가합니다."
        );
      }
      const codeData = await this.userService.getRecoveryCode(userData.id);
      if (codeData) {
        throw new BadRequestException(
          "유효한 인증번호가 이미 이메일로 발송되어 있습니다. 10분 뒤에 재전송 가능합니다."
        );
      }
      function generateSixDigitCode(): string {
        const min = 100000;
        const max = 999999;
        const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;

        return randomCode.toString();
      }
      const recoveryCode = generateSixDigitCode();
      await this.mailerService.sendChangePasswordEmail(
        userData.email,
        userData.nickname,
        recoveryCode
      );
      const { code } = await this.userService.insertRecoveryCode(
        userData.id,
        recoveryCode
      );
      return res
        .status(successCode.CREATED)
        .json(
          SuccessData(
            successCode.CREATED,
            successMessage.CREATE_POST_SUCCESS,
            code
          )
        );
    } catch (err) {
      throw err;
    }
  }
  @Post("code")
  async verifyRecoveryCode(
    @Body() codeVerifyDto: CodeVerifyDto,
    @Res() res: Response
  ) {
    try {
      const userData = await this.userService.getUserByEmail(codeVerifyDto);
      const data = await this.userService.verifyRecoveryCode(
        userData.id,
        codeVerifyDto
      );

      return res
        .status(successCode.OK)
        .json(
          SuccessData(successCode.OK, successMessage.DELETE_POST_SUCCESS, data)
        );
    } catch (err) {
      throw err;
    }
  }

  @Put("/password")
  async changePassword(
    @Body(ValidationPipe) updatePasswordDto: UpdateUserPasswordDto,
    @Res()
    res: Response
  ) {
    try {
      await this.userService.changePassword(updatePasswordDto);
      return res
        .status(successCode.OK)
        .json(SuccessData(successCode.OK, successMessage.UPDATE_POST_SUCCESS));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


}
