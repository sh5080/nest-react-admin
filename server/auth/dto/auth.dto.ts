import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class UserLoginDto {
  @ApiProperty({ example: "test123@test.com" })
  @IsString()
  @IsEmail({}, { message: "올바른 이메일 형식이어야 합니다." })
  email: string;

  @ApiProperty({ example: "test123123!" })
  @IsString()
  password: string;
}
