import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async getUserByEmail(email: string) {
    const userData = await this.prismaService.users.findUnique({
      where: { email },
    });
    return userData;
  }
  async getUserByUserId(userId: bigint) {
    const userData = await this.prismaService.users.findUnique({
      where: { id: userId },
    });
    return userData;
  }

  async upsertRecoveryCode(userId: bigint, code: string) {
    const codeData = await this.prismaService.admin_password_recovery_code.upsert({
      create: { user_id: userId, code },
      where: { user_id: userId },
      update: { code },
    });
    return codeData;
  }
  async getRecoveryCodeByUserId(userId: bigint) {
    const codeData = await this.prismaService.admin_password_recovery_code.findUnique(
      { where: { user_id: userId } }
    );
    return codeData;
  }
  async deleteRecoveryCodeByUserId(userId: bigint) {
    const codeData = await this.prismaService.admin_password_recovery_code.delete({
      where: { user_id: userId },
    });
    return codeData;
  }
  async updatePassword(userId: bigint, password: string) {
    const userCenterData = await this.prismaService.users.update({
      where: { id: userId },
      data: { password },
    });
    return userCenterData;
  }
}
