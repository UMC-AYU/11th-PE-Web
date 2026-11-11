import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginRequestDto {
    @IsEmail({}, { message: "올바른 이메일 형식이 아닙니다." })
    email!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;
}
