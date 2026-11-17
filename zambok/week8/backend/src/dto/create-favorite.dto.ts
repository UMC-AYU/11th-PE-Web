import { IsInt, Max, Min } from "class-validator";

export class CreateFavoriteDto {
    @IsInt()
    @Min(1)
    @Max(2_147_483_647)
    movieId!: number;
}
