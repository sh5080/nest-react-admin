import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async getToken(token: string) {
    const tokenData = await this.prismaService.user_tokens.findUnique({
      where: { refresh_token: token },
    });
    return tokenData;
  }
  async upsertSession(
    userId: bigint,
    refreshToken: string,
    ip: string,
    userAgent: string
  ) {
    const transactionResult = await this.prismaService.$transaction(
      async (prisma) => {
        const insertRefresh = await prisma.user_tokens.upsert({
          where: { user_id: userId },
          update: {
            refresh_token: refreshToken,
            refresh_count: {
              increment: 1,
            },
            ip: ip,
            user_agent: userAgent,
          },
          create: {
            user_id: userId,
            refresh_token: refreshToken,
            created_at: new Date(),
            updated_at: new Date(),
            valid: true,
            refresh_count: 0,
            ip: ip,
            user_agent: userAgent,
          },
        });

        return insertRefresh;
      }
    );
  }
}
