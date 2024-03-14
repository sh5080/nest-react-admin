import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { CodeVerifyDto, IsUserDto } from "./dto/sendMail.dto";
import { differenceInMinutes } from "date-fns";
import { UpdateUserPasswordDto } from "./dto/user.dto";
import * as bcrypt from "bcrypt";
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async getUserByEmail(isUserDto: IsUserDto) {
    try {
      const userData = await this.userRepository.getUserByEmail(
        isUserDto.email
      );
      if (!userData) {
        throw new NotFoundException(
          "가입된 회원정보와 이메일이 일치하지 않거나 유효하지 않은 이메일입니다."
        );
      }

      return userData
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  async insertRecoveryCode(userId: bigint, recoveryCode: string) {
    try {
      const codeData = await this.userRepository.upsertRecoveryCode(
        userId,
        recoveryCode
      );
      return codeData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  async getRecoveryCode(userId: bigint) {
    try {
      const codeData = await this.userRepository.getRecoveryCodeByUserId(
        userId
      );
      if (!codeData) {
        return null;
      }
      const now = new Date();
      const minutesDifference = differenceInMinutes(now, codeData.created_at);
      if (minutesDifference > 10) {
        await this.userRepository.deleteRecoveryCodeByUserId(userId);
        return null;
      }

      return codeData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  async verifyRecoveryCode(userId: bigint, codeVerifyDto: CodeVerifyDto) {
    try {
      const codeData = await this.userRepository.getRecoveryCodeByUserId(
        userId
      );
      if (!codeData) {
        throw new BadRequestException(
          "유효하지 않은 인증입니다. 다시 요청해주세요."
        );
      }
      if (codeVerifyDto.code !== codeData.code) {
        throw new BadRequestException("6자리 인증번호가 일치하지 않습니다.");
      }

      const now = new Date();
      const minutesDifference = differenceInMinutes(now, codeData.created_at);
      await this.userRepository.deleteRecoveryCodeByUserId(userId);
      if (minutesDifference > 10) {
        throw new BadRequestException(
          "인증 코드의 유효 시간이 만료되었습니다. 다시 요청해주세요."
        );
      }

      return codeData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async changePassword(updatePasswordDto: UpdateUserPasswordDto) {
    try {
      const hashedPassword = await bcrypt.hash(updatePasswordDto.password, 10);
      const userCenterData = await this.userRepository.updatePassword(
        updatePasswordDto.userId,
        hashedPassword
      );
      if (!userCenterData) {
        throw new BadRequestException("비밀번호 변경에 실패했습니다.");
      }
      return userCenterData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
