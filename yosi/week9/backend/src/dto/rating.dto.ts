// src/dto/rating.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import type { Member } from '../entity/member.entity.js';
import type { Rating } from '../entity/rating.entity.js';

// 한줄평은 앞뒤 공백을 지우고, 빈 문자열이면 null(한줄평 없음)로 저장합니다.
const toComment = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
};

// 요청 DTO: POST /members/{memberId}/ratings
export class CreateRatingRequestDto {
  @ApiProperty({ description: 'TMDB 영화 ID', example: 550 })
  @Type(() => Number)
  @IsInt({ message: '영화 ID는 정수로 입력해 주세요.' })
  @Min(1, { message: '영화 ID는 1 이상이어야 합니다.' })
  movieId: number;

  @ApiProperty({ description: '별점 (1~5 정수)', example: 5 })
  @Type(() => Number)
  @IsInt({ message: '평점은 정수로 입력해 주세요.' })
  @Min(1, { message: '평점은 1점 이상이어야 합니다.' })
  @Max(5, { message: '평점은 5점 이하여야 합니다.' })
  score: number;

  @ApiPropertyOptional({
    description: '한줄평 (500자 이하, 없으면 null)',
    example: '오랜 시간이 지나도 좋네요.',
  })
  @IsOptional()
  @Transform(toComment)
  @IsString({ message: '한줄평은 문자열로 입력해 주세요.' })
  @MaxLength(500, { message: '한줄평은 500자 이하로 입력해 주세요.' })
  comment?: string | null;
}

// 요청 DTO: PATCH /members/{memberId}/ratings/{ratingId}
// 보낸 값만 바꿉니다. 영화는 바꿀 수 없어서 movieId는 받지 않습니다.
export class UpdateRatingRequestDto {
  @ApiPropertyOptional({ description: '별점 (1~5 정수)', example: 4 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '평점은 정수로 입력해 주세요.' })
  @Min(1, { message: '평점은 1점 이상이어야 합니다.' })
  @Max(5, { message: '평점은 5점 이하여야 합니다.' })
  score?: number;

  // null을 보내면 한줄평을 지웁니다.
  @ApiPropertyOptional({
    description: '한줄평 (null을 보내면 지워요)',
    example: '다시 보니 조금 어려워요.',
  })
  @IsOptional()
  @Transform(toComment)
  @IsString({ message: '한줄평은 문자열로 입력해 주세요.' })
  @MaxLength(500, { message: '한줄평은 500자 이하로 입력해 주세요.' })
  comment?: string | null;
}

// 응답 DTO: 평점 한 개 (회원 정보나 비밀번호 같은 Entity 내부 구조를 노출하지 않음)
export class RatingResponseDto {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;

  static from(rating: Rating): RatingResponseDto {
    return {
      // DB의 BIGINT 값은 TypeORM이 문자열로 돌려줄 수 있어서 숫자로 바꿔서 응답합니다.
      ratingId: Number(rating.ratingId),
      movieId: Number(rating.movieId),
      score: rating.score,
      comment: rating.comment,
      createdAt: rating.createdAt,
      updatedAt: rating.updatedAt,
    };
  }
}

// 응답 DTO: 유저별 평점 목록
export class MemberRatingsResponseDto {
  memberId: number;
  nickname: string;
  ratingCount: number;
  ratings: RatingResponseDto[];

  static from(member: Member, ratings: Rating[]): MemberRatingsResponseDto {
    return {
      memberId: Number(member.memberId),
      nickname: member.nickname,
      ratingCount: ratings.length,
      ratings: ratings.map((rating) => RatingResponseDto.from(rating)),
    };
  }
}
