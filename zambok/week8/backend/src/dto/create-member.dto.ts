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
    email!: string;

    @IsString()
    @MinLength(2)
    @MaxLength(12)
    nickname!: string;

    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/, {
        message: "비밀번호는 대소문자, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.",
    })
    password!: string;
}