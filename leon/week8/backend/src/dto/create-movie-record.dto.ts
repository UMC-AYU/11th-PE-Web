import { IsBoolean, IsInt, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieRecordDto {
  @ApiProperty({ example: 238, description: 'TMDB 영화 ID' })
  @IsInt({ message: '영화 ID는 정수여야 합니다.' })
  @IsPositive({ message: '영화 ID는 양수여야 합니다.' })
  movieId: number;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt({ message: '별점은 정수여야 합니다.' })
  @Min(1, { message: '별점은 1점 이상이어야 합니다.' })
  @Max(5, { message: '별점은 5점 이하여야 합니다.' })
  score: number;

  @ApiPropertyOptional({ example: '다시 보고 싶은 영화입니다.' })
  @IsOptional()
  @IsString({ message: '감상평은 문자열이어야 합니다.' })
  comment?: string;

  @ApiProperty({ example: true, description: 'true이면 평점과 즐겨찾기를 한 트랜잭션에 저장' })
  @IsBoolean({ message: '즐겨찾기 추가 여부는 true 또는 false여야 합니다.' })
  addToFavorites: boolean;
}
