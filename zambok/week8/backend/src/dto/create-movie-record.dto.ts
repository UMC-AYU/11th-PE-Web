import { IsBoolean, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";
import { CreateFavoriteDto } from "./create-favorite.dto";

export class CreateMovieRecordDto extends CreateFavoriteDto {
    @IsInt()
    @Min(1)
    @Max(5)
    score!: number;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    comment?: string;

    @IsBoolean()
    addToFavorites!: boolean;
}
