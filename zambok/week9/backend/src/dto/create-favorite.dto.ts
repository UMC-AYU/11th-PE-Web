import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Max, Min } from "class-validator";

export class CreateFavoriteDto {
    @IsInt()
    @Min(1)
    @Max(2_147_483_647)
    @ApiProperty({ description: 'TMDB 영화 ID', example: 550, minimum: 1, maximum: 2147483647 })
    movieId!: number;
}
