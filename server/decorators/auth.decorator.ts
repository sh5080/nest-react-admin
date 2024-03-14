import {
  createParamDecorator,
  ExecutionContext,
  NotAcceptableException,
} from "@nestjs/common";
import { AuthRequest } from "../types/request.type";

export const CenterAdmin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: AuthRequest = request.user;

    if (!user || user.role !== 3) {
      throw new NotAcceptableException("센터 관리자 계정만 접근 가능합니다.");
    }

    return user;
  }
);

export const CenterUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: AuthRequest = request.user;
    if (!user || (user.role !== 2 && user.role !== 3)) {
      throw new NotAcceptableException("센터 계정만 접근 가능합니다.");
    }

    return user;
  }
);
