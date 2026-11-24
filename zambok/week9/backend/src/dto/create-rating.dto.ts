import { ApiProperty } from "@nestjs/swagger";
import {
    IsInt,
    IsOptional,
    Max,
    MaxLength,
    Min,
} from "class-validator";

export class CreateRatingDto {
    @IsInt()
    @Min(1)
    @ApiProperty({ description: 'TMDB 영화 ID', example: 550, minimum: 1 })
    movieId!: number;

    @IsInt()
    @Min(1)
    @Max(5)
    @ApiProperty({ description: '영화 평점', example: 5, minimum: 1, maximum: 5 })
    score!: number;

    @IsOptional()
    @MaxLength(500)
    @ApiProperty({ description: '한줄평', example: '인상적인 영화였어요.', maxLength: 500, required: false })
    comment?: string;
}