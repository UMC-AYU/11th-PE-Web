import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginRequestDto {
    @IsEmail({}, { message: "올바른 이메일 형식이 아닙니다." })
    @ApiProperty({ description: '가입 이메일', example: 'member@example.com' })
    email!: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: '비밀번호', example: 'ExamplePass1!', format: 'password', writeOnly: true })
    password!: string;
}
