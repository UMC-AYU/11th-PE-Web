// src/dto/movie-record.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateRatingRequestDto, RatingResponseDto } from './rating.dto.js';
import { FavoriteResponseDto } from './favorite-response.dto.js';

// 요청 DTO: POST /movie-records
// movieId, score, comment 검증은 평점 등록 DTO를 그대로 물려받고 addToFavorites만 추가합니다.
export class CreateMovieRecordRequestDto extends CreateRatingRequestDto {
  @ApiPropertyOptional({
    description: 'true면 즐겨찾기도 함께 저장',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'addToFavorites는 true 또는 false로 입력해 주세요.' })
  addToFavorites?: boolean;
}

// 응답 DTO: 영화 기록 저장 결과
export class MovieRecordResponseDto {
  rating: RatingResponseDto;
  // addToFavorites가 false면 null입니다.
  favorite: FavoriteResponseDto | null;
}
