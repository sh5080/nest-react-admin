import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  ValidationPipe,
  Get,
  UseGuards,
  Delete,
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import {
  SuccessData,
  successCode,
  successMessage,
} from "../middlewares/error.middleware";
import { AuthService } from "../auth/auth.service";
import { AuthRequest } from "../types/request.type";
import { authConfig } from "../config/env.config";
import { UserLoginDto } from "./dto/auth.dto";
import * as crypto from "crypto";
import { AuthGuard } from "./auth.guard";

@ApiTags("로그인")
@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: "로그인 예시",
  })
  @ApiOkResponse({
    description: "로그인",
    schema: {
      example: {
        statusCode: 200,
        message: "Login Success",
      },
    },
  })
  @Post("/login")
  async login(
    @Body(ValidationPipe) userLoginDto: UserLoginDto,
    @Req()
    req: AuthRequest,
    @Res()
    res: Response
  ) {
    try {
      const ip = req.ip;
      const userAgent = req.get("User-Agent");
      const loginData = await this.authService.login(
        userLoginDto,
        ip,
        userAgent
      );

      const accessEnv = authConfig().ACCESS_JWT_EXPIRATION;
      const refreshEnv = authConfig().REFRESH_JWT_EXPIRATION;

      const now = new Date();
      const accessExp = new Date(now.getTime() + accessEnv * 1000);
      const refreshExp = new Date(now.getTime() + refreshEnv * 1000);

      const accessOptions: {
        expires: Date;
        httpOnly: boolean;
        secure?: boolean | undefined;
        domain?: string | undefined;
      } = {
        expires: accessExp,
        httpOnly: true,
      };

      const refreshOptions: {
        expires: Date;
        httpOnly: boolean;
        secure?: boolean | undefined;
        domain?: string | undefined;
      } = {
        expires: refreshExp,
        httpOnly: true,
      };
      const frontAccessOptions: {
        expires: Date;
        httpOnly: boolean;
        secure?: boolean | undefined;
        domain?: string | undefined;
      } = {
        expires: accessExp,
        httpOnly: false,
      };
      if (process.env.NODE_ENV === "development") {
        accessOptions.domain = authConfig().DEV_DOMAIN;
        refreshOptions.domain = authConfig().DEV_DOMAIN;
      }

      if (process.env.NODE_ENV === "production") {
        accessOptions.secure = true;
        refreshOptions.secure = true;
      }
      const userLoginData = {
        nickname: loginData.userData.nickname,
        role: loginData.userData.role,
      };
      const generateRandomToken = () => {
        return crypto.randomUUID();
      };

      const randomToken = generateRandomToken();
      return res
        .cookie("SAID", randomToken, frontAccessOptions)
        .cookie("access", loginData.tokens.accessToken, accessOptions)
        .cookie("refresh", loginData.tokens.refreshToken, refreshOptions)
        .status(successCode.OK)
        .json(
          SuccessData(
            successCode.OK,
            successMessage.LOGIN_SUCCESS,
            userLoginData
          )
        );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  @Get("/check")
  @UseGuards(AuthGuard)
  async check(
    @Req() req: AuthRequest,
    @Res()
    res: Response
  ) {
    try {
      const accessEnv = authConfig().ACCESS_JWT_EXPIRATION;
      const now = new Date();
      const accessExp = new Date(now.getTime() + accessEnv * 1000);

      const generateRandomToken = () => {
        return crypto.randomUUID();
      };
      const randomToken = generateRandomToken();
      const frontAccessOptions: {
        expires: Date;
        httpOnly: boolean;
        secure?: boolean | undefined;
        domain?: string | undefined;
      } = {
        expires: accessExp,
        httpOnly: false,
      };
      const userLoginData = { userId: req.user.userId, role: req.user.role };
      return res
        .cookie("SAID", randomToken, frontAccessOptions)
        .json(SuccessData(successCode.OK, "Check Success", userLoginData));
    } catch (err) {
      throw err;
    }
  }
  @Delete("/logout")
  @UseGuards(AuthGuard)
  async logout(
    @Req() req: AuthRequest,
    @Res()
    res: Response
  ) {
    try {
      return res
        .clearCookie("SAID")
        .clearCookie("access")
        .clearCookie("refresh")
        .json(SuccessData(successCode.OK, "Logout Success"));
    } catch (err) {
      throw err;
    }
  }
}
