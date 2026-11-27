// src/dto/my-profile.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import type { Member } from '../entity/member.entity.js';

// 요청 DTO: PATCH /members/me (회원가입과 같은 닉네임 규칙)
export class UpdateMyProfileDto {
  @ApiProperty({ description: '새 닉네임 (2~12자)', example: '영화광' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: '닉네임을 입력해주세요.' })
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  @MinLength(2, { message: '닉네임은 2자 이상이어야 합니다.' })
  @MaxLength(12, { message: '닉네임은 12자 이하여야 합니다.' })
  nickname: string;
}

// 응답 DTO: 내 정보 조회·수정 결과 (비밀번호는 포함하지 않습니다.)
export class MyProfileResponseDto {
  email: string;
  nickname: string;
  createdAt: Date;

  static from(member: Member): MyProfileResponseDto {
    return {
      email: member.email,
      nickname: member.nickname,
      createdAt: member.createdAt,
    };
  }
}
