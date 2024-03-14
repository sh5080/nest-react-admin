import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches } from "class-validator";

export class IsUserDto {
  @ApiProperty({ example: "prpn97@gmail.com" })
  @IsString()
  @IsEmail({}, { message: "올바른 이메일 형식이어야 합니다." })
  email: string;

  @ApiProperty({ example: "01012121212" })
  @IsString()
  @Matches(/^010[1-9]\d{7}$/)
  phone: string;
}

export class CodeVerifyDto extends IsUserDto {
  @ApiProperty({ example: "123456" })
  @IsString()
  code: string;
}
