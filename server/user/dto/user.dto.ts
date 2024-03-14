import { ApiProperty } from "@nestjs/swagger";
import {
  Equals,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from "class-validator";
import { IsEqualTo } from "../../decorators/validate.decorator";

export class UpdateUserPasswordDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  userId: bigint;

  @ApiProperty({ example: "test123123!" })
  @IsString()
  @MinLength(10, { message: "비밀번호는 최소 10자 이상이어야 합니다." })
  @Matches(/^(?=.*[!@#$%^&*])/g, {
    message: "비밀번호에는 특수문자 최소 한 개가 포함되어야 합니다.",
  })
  password: string;

  @ApiProperty({ example: "test123123!" })
  @IsString()
  @IsNotEmpty({ message: "비밀번호 확인은 필수입니다." })
  @IsEqualTo("password", { message: "비밀번호와 일치해야 합니다." })
  confirmPassword: string;
}
