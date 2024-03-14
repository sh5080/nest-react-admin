import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { Request, Response } from "express";
import { PrismaService } from "../prisma/prisma.service";
import { AuthRequest } from "../types/request.type";
import { AwsS3MulterConfigService } from "./awsS3Multer.middleware";
import { ImageError } from "../types/error.type";

export const successCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
};

export const errorCode = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  DUPLICATE: 400,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  DB_ERROR: 600,
};

export const SuccessData = (
  statusCode: number,
  message?: string,
  data?: any
) => {
  if (statusCode === 200 && !message) {
    message = "success";
  }
  return {
    statusCode,
    message,
    data,
  };
};

export const successMessage = {
  LOGIN_SUCCESS: "Login Success",
  CREATE_POST_SUCCESS: "Create Success",
  READ_POST_SUCCESS: "Find Success",
  UPDATE_POST_SUCCESS: "Update Success",
  DELETE_POST_SUCCESS: "Delete Success",
};

export const errorMessage = {
  NULL_VALUE: "Nullable Value",
  REGEX_CHECK: "Regex Check",
  DUPLICATE: "Duplicated Value",
  NOT_FOUND: "Not Found",
  CONFLICT: "Already Exists",
  BAD_REQUEST: "Bad Request",
  UNIQUE_CONSTRAINT_ERROR: "Unique Constraint Error",
  FORBIDDEN: "Forbidden",
  UNAUTHORIZED: "Unauthorized Error",
  INTERNAL_SERVER_ERROR: "Server Error",
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly imageService: AwsS3MulterConfigService
  ) {}
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const authRequest = ctx.getRequest<AuthRequest>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = (exception as any).message.message;
    let detail = "Unexpected Error";

    console.log("@@@@", exception);
    if (exception instanceof ImageError) {
      status = exception.status;
      message = exception.message;
      detail = exception.detail;
      const files = request.files;
      for (const fieldName of Object.keys(files)) {
        for (const file of files[fieldName]) {
          this.imageService.deleteImageFromS3(file.location);
        }
      }
      return response.status(status).json({
        message: detail,
        error: message,
        statusCode: status,
      });
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
      if (message.message.includes("JSON at position")) {
        message.message = "정상적인 입력값이 아닙니다.";
      }
      if (Array.isArray(message.message) && message.message.length > 1) {
        // 여러 에러 메시지 중 첫 번째 메시지 사용
        return response.status(status).json({
          message: message.message[0],
          error: message.error,
          statusCode: status,
        });
      }
      return response.status(status).json(message);
    } else if (
      exception instanceof PrismaClientKnownRequestError ||
      exception instanceof PrismaClientValidationError
    ) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = "UnExpected Error";
      console.log(exception.message);

      return response
        .status(status)
        .json({ message: message, statusCode: status });
    } else {
      const unexpectedMsg = (exception as any).message;
      const unexpectedStack = (exception as any).response
        ? exception.response
        : null;
      const user: AuthRequest = authRequest.user;
      const unexpectedErrData = await this.prismaService.error_log.create({
        data: {
          user_id: user ? user.userId : null,
          message: unexpectedMsg,
          stack: unexpectedStack,
        },
      });
      console.log("error saved in db successfully", unexpectedErrData);
      return response.status(status).json({
        error: detail,
        statusCode: status,
        message: "예상치 못한 오류입니다. 관리자에게 문의해 주세요.",
      });
    }
  }
}
