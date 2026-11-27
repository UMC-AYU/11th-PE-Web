// src/dto/create-favorite.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

// 요청 DTO: POST /favorites (memberId는 토큰이 알려주니까 받지 않습니다.)
export class CreateFavoriteDto {
  @ApiProperty({
    description: '즐겨찾기할 TMDB 영화 ID (양의 정수)',
    example: 550,
  })
  @IsNotEmpty({ message: '영화 ID는 필수입니다.' })
  @IsInt({ message: '영화 ID는 정수여야 합니다.' })
  @IsPositive({ message: '영화 ID는 양수여야 합니다.' })
  movieId: number;
}
