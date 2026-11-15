import { IsInt, IsString, Max, Min, ValidateIf } from 'class-validator';

export class UpdateRatingDto {
  @ValidateIf((_, value) => value !== undefined)
  @IsInt({ message: '별점은 정수여야 합니다.' })
  @Min(1, { message: '별점은 1점 이상이어야 합니다.' })
  @Max(5, { message: '별점은 5점 이하여야 합니다.' })
  score?: number;

  @ValidateIf((_, value) => value !== undefined)
  @IsString({ message: '리뷰는 문자열이어야 합니다.' })
  review?: string;
}
