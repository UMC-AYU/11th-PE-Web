import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteDto {
  @ApiProperty({ example: 550, description: 'TMDB 영화 ID' })
  @IsInt({ message: '영화 ID는 정수여야 합니다.' })
  @IsPositive({ message: '영화 ID는 양수여야 합니다.' })
  movieId: number;
}
