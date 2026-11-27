// src/dto/member.dto.ts
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

// 앞뒤 공백을 지운 뒤 검증해서 "   " 같은 값도 빈 값으로 막습니다.
const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

// 요청 DTO: GET /members/nickname/{nickname}
export class NicknameParamDto {
  @Transform(trim)
  @IsNotEmpty({ message: '닉네임을 입력해 주세요.' })
  @MaxLength(50, { message: '닉네임은 50자 이하로 입력해 주세요.' })
  nickname: string;
}

// 요청 DTO: GET /members/email/{email}
export class EmailParamDto {
  @Transform(trim)
  @IsNotEmpty({ message: '이메일을 입력해 주세요.' })
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  @MaxLength(254, { message: '이메일은 254자 이하로 입력해 주세요.' })
  email: string;
}

// 응답 DTO: 닉네임 중복 체크 결과 (available: true면 사용 가능)
export class NicknameAvailabilityResponseDto {
  nickname: string;
  available: boolean;
}

// 응답 DTO: 이메일 중복 체크 결과 (available: true면 사용 가능)
export class EmailAvailabilityResponseDto {
  email: string;
  available: boolean;
}
