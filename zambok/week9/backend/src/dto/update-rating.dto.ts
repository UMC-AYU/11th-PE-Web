import { ApiProperty } from "@nestjs/swagger";
import {
    IsInt,
    IsOptional,
    Max,
    MaxLength,
    Min,
} from "class-validator";

export class UpdateRatingDto {
    @IsInt()
    @Min(1)
    @Max(5)
    @ApiProperty({ description: '변경할 평점', example: 4, minimum: 1, maximum: 5 })
    score!: number;

    @IsOptional()
    @MaxLength(500)
    @ApiProperty({ description: '변경할 한줄평', example: '다시 보고 싶은 영화예요.', maxLength: 500, required: false })
    comment?: string;
}