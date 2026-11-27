// src/dto/login-request.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// 요청 DTO: POST /auth/login
export class LoginRequestDto {
  @ApiProperty({ description: '가입한 이메일', example: 'movie@umc.com' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  // 로그인 단계에서는 비밀번호 규칙(대소문자/숫자/특수문자)까지 검사하지 않습니다.
  // 규칙은 가입할 때 이미 검사했고, 여기서는 저장된 해시와 맞는지만 확인하면 됩니다.
  @ApiProperty({ description: '비밀번호', example: 'Umc1234!' })
  @IsString({ message: '비밀번호를 입력해주세요.' })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;
}

// 응답 DTO: 로그인 결과
export class LoginResponseDto {
  nickname: string;
  accessToken: string;
}
