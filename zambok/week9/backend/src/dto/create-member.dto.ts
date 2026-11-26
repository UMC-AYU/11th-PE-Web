import { ApiProperty } from "@nestjs/swagger";
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from "class-validator";

export class CreateMemberDto {
    @IsEmail({}, { message: "올바른 이메일 형식이 아닙니다." })
    @IsNotEmpty()
    @ApiProperty({ description: '가입 이메일', example: 'member@example.com', format: 'email' })
    email!: string;

    @IsString()
    @MinLength(2)
    @MaxLength(12)
    @ApiProperty({ description: '닉네임', example: '잠복', minLength: 2, maxLength: 12 })
    nickname!: string;

    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/, {
        message: "비밀번호는 대소문자, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.",
    })
    @ApiProperty({ description: '대소문자·숫자·특수문자 포함 8자 이상', example: 'ExamplePass1!', format: 'password', writeOnly: true })
    password!: string;
}