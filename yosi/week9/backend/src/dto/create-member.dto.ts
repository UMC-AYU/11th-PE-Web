// src/dto/create-member.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import type { Member } from '../entity/member.entity.js';

// 앞뒤 공백을 지운 뒤 검증해서 "   " 같은 값도 빈 값으로 막습니다.
const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

// 요청 DTO: POST /members (회원가입)
export class CreateMemberDto {
  @ApiProperty({
    description: '이메일 (254자 이하)',
    example: 'umc9@example.com',
  })
  @Transform(trim)
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  @MaxLength(254, { message: '이메일은 254자 이하여야 합니다.' })
  email: string;

  // 비밀번호는 공백도 의미가 있을 수 있어서 trim하지 않습니다.
  @ApiProperty({
    description:
      '대문자·소문자·숫자·특수문자(!@#$%^&*)를 포함한 8자 이상, 72자 이하',
    example: 'Abcd123!',
  })
  @IsString({ message: '비밀번호를 입력해주세요.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/, {
    message:
      '비밀번호는 대문자/소문자/숫자/특수문자를 포함한 8자 이상이어야 합니다.',
  })
  // bcrypt는 72바이트까지만 해시에 반영하므로 그보다 긴 비밀번호는 막습니다.
  @MaxLength(72, { message: '비밀번호는 72자 이하여야 합니다.' })
  password: string;

  @ApiProperty({ description: '닉네임 (2~12자)', example: '무비팬' })
  @Transform(trim)
  @IsString({ message: '닉네임을 입력해주세요.' })
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  @MinLength(2, { message: '닉네임은 2자 이상이어야 합니다.' })
  @MaxLength(12, { message: '닉네임은 12자 이하여야 합니다.' })
  nickname: string;
}

// 응답 DTO: 회원가입 결과 (비밀번호는 절대 포함하지 않습니다.)
export class MemberResponseDto {
  memberId: number;
  email: string;
  nickname: string;

  static from(member: Member): MemberResponseDto {
    return {
      memberId: Number(member.memberId),
      email: member.email,
      nickname: member.nickname,
    };
  }
}
