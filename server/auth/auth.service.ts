import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { authConfig } from "../config/env.config";

import { AuthRepository } from "./auth.repository";
import { UserLoginDto } from "./dto/auth.dto";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import { UserRepository } from "../user/user.repository";
import { AuthRequest } from "../types/request.type";

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository
  ) {}
  private async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
  async login(userLoginDto: UserLoginDto, ip: string, userAgent: string) {
    try {
      const userData = await this.userRepository.getUserByEmail(
        userLoginDto.email
      );
      if (!userData) {
        throw new NotFoundException("아이디 혹은 비밀번호가 일치하지 않습니다.");
      }

      if (userData.role < 1 || userData.role > 2) {
        throw new BadRequestException("관리자만 로그인 가능합니다.");
      }
      const isPasswordValid = await this.verifyPassword(
        userLoginDto.password,
        userData.password
      );
      if (!isPasswordValid) {
        throw new BadRequestException("아이디 혹은 비밀번호가 일치하지 않습니다.");
      }

      const tokenData = await this.createTokens(
        userData.id,
        ip,
        userAgent,
        userData.role
      );
      return { tokens: tokenData, userData: userData };
    } catch (error) {
      throw error;
    }
  }

  async createTokens(
    userId: bigint,
    ip: string,
    userAgent: string,
    role: number
  ) {
    try {
      let accessTokenPayload: {
        userId: string;
        role: string;
      };

      accessTokenPayload = {
        userId: userId.toString(),
        role: role.toString(),
      };

      const accessToken = jwt.sign(
        accessTokenPayload,
        authConfig().ACCESS_JWT_SECRET,
        {
          expiresIn: authConfig().ACCESS_JWT_EXPIRATION,
          audience: "neurocircuit",
          issuer: authConfig().JWT_ISSUER,
        }
      );
      const refreshTokenPayload = { uuid: uuidv4() };
      const refreshToken = jwt.sign(
        refreshTokenPayload,
        authConfig().REFRESH_JWT_SECRET,
        {
          expiresIn: authConfig().REFRESH_JWT_EXPIRATION,
          audience: "neurocircuit",
          issuer: authConfig().JWT_ISSUER,
        }
      );
      await this.authRepository.upsertSession(
        userId,
        refreshToken,
        ip,
        userAgent
      );
      return { accessToken, refreshToken };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  async updateTokens(
    userId: bigint,
    ip: string,
    userAgent: string
  ) {
    try {
      const userData = await this.userRepository.getUserByUserId(userId);
      if (!userData) {
        throw new NotAcceptableException("존재하지 않는 user입니다.");
      }
      let accessTokenPayload: {
        userId: string;
        role: string;
      };

      accessTokenPayload = {
        userId: userId.toString(),
        role: userData.role.toString(),
      };

      const newAccessToken = jwt.sign(
        accessTokenPayload,
        authConfig().ACCESS_JWT_SECRET,
        {
          expiresIn: authConfig().ACCESS_JWT_EXPIRATION,
          audience: "neurocircuit",
          issuer: authConfig().JWT_ISSUER,
        }
      );
      const refreshTokenPayload = { uuid: uuidv4() };
      const newRefreshToken = jwt.sign(
        refreshTokenPayload,
        authConfig().REFRESH_JWT_SECRET,
        {
          expiresIn: authConfig().REFRESH_JWT_EXPIRATION,
          audience: "neurocircuit",
          issuer: authConfig().JWT_ISSUER,
        }
      );
      await this.authRepository.upsertSession(
        userId,
        newRefreshToken,
        ip,
        userAgent
      );

      return { newAccessToken, newRefreshToken };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async verify(token: string, secret: string, type: string) {
    try {
      if (type === "refresh") {
        const sessionData = await this.authRepository.getToken(token);
        if (!sessionData) {
          throw new UnauthorizedException("인증 정보가 없습니다.");
        }
        const userData = await this.userRepository.getUserByUserId(
          sessionData.user_id
        );
        return { userId: sessionData.user_id, role: userData.role };
      } else {
        const payload = jwt.verify(token, secret, {
          algorithms: ["HS256"],
        }) as jwt.JwtPayload & AuthRequest;
        const { userId, role } = payload;
        return { userId, role };
      }
    } catch (err) {
      console.error(err);
      if (err instanceof UnauthorizedException) {
        throw new UnauthorizedException("refresh token expired");
      } else if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException("Token expired");
      } else if (err instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException("Token invalid");
      } else {
        throw new InternalServerErrorException("UnExpected");
      }
    }
  }
}
